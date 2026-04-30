  const user = JSON.parse(localStorage.getItem('dh_user') || '{}');
  if (!user.loggedIn || user.role !== 'service-provider') window.location.href = 'login.html';
  function logout() { localStorage.removeItem('dh_user'); window.location.href = 'login.html'; }
 
  const patients = [
    { name:'Amara Osei', gender:'Female', age:40, dob:'12 Mar 1985', phone:'+234 801 111 2222', email:'amara@email.com', address:'Egbeda, Lagos', service:'Post-Discharge Recovery', plan:'6-Week Recovery Plan', since:'2 Apr 2026', visits:12, total:18, condition:'Post-appendectomy recovery', allergies:'Penicillin', medications:'Amlodipine 5mg, Metronidazole 400mg', emergency:'Kofi Osei (Husband) — +234 800 999 8888', notes:'Wound healing well. BP slightly elevated. Continue medication. Watch for signs of infection.', history:[{d:'22',m:'Apr',t:'Wound Care & Medication Check'},{d:'19',m:'Apr',t:'Vital Signs Monitoring'},{d:'15',m:'Apr',t:'Post-Discharge Assessment'}] },
    { name:'Emeka Nwachukwu', gender:'Male', age:53, dob:'4 Jun 1972', phone:'+234 802 222 3333', email:'emeka@email.com', address:'Surulere, Lagos', service:'Chronic Care Management', plan:'Monthly Monitoring', since:'15 Mar 2026', visits:18, total:null, condition:'Type 2 Diabetes, Hypertension', allergies:'None known', medications:'Metformin 500mg, Lisinopril 10mg', emergency:'Chioma Nwachukwu (Wife) — +234 800 777 6666', notes:'HbA1c improving — 7.2. Blood sugar stable. Continue dietary guidance. Foot inspection each visit.', history:[{d:'25',m:'Apr',t:'Blood Sugar Check'},{d:'18',m:'Apr',t:'Medication Review'},{d:'11',m:'Apr',t:'Routine Monitoring'}] },
    { name:'Grace Okonkwo', gender:'Female', age:77, dob:'29 Aug 1948', phone:'+234 803 333 4444', email:'grace@email.com', address:'Yaba, Lagos', service:'Elderly Care Support', plan:'Daily Visits', since:'1 Feb 2026', visits:34, total:null, condition:'Age-related mobility issues, Mild hypertension', allergies:'Sulfa drugs', medications:'Amlodipine 2.5mg daily', emergency:'Emeka Okonkwo (Son) — +234 800 555 4444', notes:'Mobility improving slowly. No falls in 3 weeks. Medication compliance good.', history:[{d:'27',m:'Apr',t:'Daily Care Visit'},{d:'26',m:'Apr',t:'Daily Care Visit'},{d:'25',m:'Apr',t:'Daily Care Visit'}] },
    { name:'Fatima Kabir', gender:'Female', age:28, dob:'11 Jan 1998', phone:'+234 804 444 5555', email:'fatima@email.com', address:'Ikeja, Lagos', service:'Postnatal Mother & Baby Care', plan:'2-Week Starter Plan', since:'25 Apr 2026', visits:2, total:8, condition:'Postnatal — vaginal delivery, no complications', allergies:'None known', medications:'Folic acid, Iron supplement', emergency:'Aliyu Kabir (Husband) — +234 800 333 2222', notes:'First-time mother. Baby weight 3.1kg — gaining well. Breastfeeding improving.', history:[{d:'26',m:'Apr',t:'Day 2 Newborn Check'},{d:'25',m:'Apr',t:'First Postnatal Visit'}] },
    { name:'Taiwo Oluwaseun', gender:'Male', age:62, dob:'7 May 1963', phone:'+234 805 555 6666', email:'taiwo@email.com', address:'Gbagada, Lagos', service:'Home Nursing Care', plan:'Weekly Visits', since:'10 Apr 2026', visits:8, total:null, condition:'Hypertension, Overweight', allergies:'Aspirin', medications:'Amlodipine 5mg, Losartan 50mg', emergency:'Bisi Oluwaseun (Wife) — +234 800 111 0000', notes:'BP 136/88. Medication Amlodipine 5mg daily. Reduce salt. Stress management discussed.', history:[{d:'21',m:'Apr',t:'BP Monitoring'},{d:'14',m:'Apr',t:'Medication Check'},{d:'7',m:'Apr',t:'Initial Assessment'}] },
    { name:'Bukola Ibrahim', gender:'Female', age:45, dob:'3 Oct 1980', phone:'+234 806 666 7777', email:'bukola@email.com', address:'Magodo, Lagos', service:'Home Nursing Care', plan:'3x Weekly Wound Care', since:'18 Apr 2026', visits:5, total:7, condition:'Post-cholecystectomy wound care', allergies:'None known', medications:'Amoxicillin 500mg, Paracetamol PRN', emergency:'Seun Ibrahim (Husband) — +234 800 222 1111', notes:'Wound dressing 3x weekly. No signs of infection. Healing well.', history:[{d:'25',m:'Apr',t:'Wound Dressing'},{d:'22',m:'Apr',t:'Wound Dressing'},{d:'19',m:'Apr',t:'Wound Assessment'}] },
    { name:'Chukwuemeka Uche', gender:'Male', age:62, dob:'7 May 1963', phone:'+234 807 777 8888', email:'chukwu@email.com', address:'Gbagada, Lagos', service:'Chronic Care Management', plan:'Monthly Monitoring (On Hold)', since:'10 Jan 2026', visits:8, total:null, condition:'Type 2 Diabetes', allergies:'None known', medications:'Metformin 1000mg', emergency:'Ngozi Uche (Wife) — +234 800 000 9999', notes:'Patient travelling. Medication supplied for 2 weeks. Resumes 5 May.', history:[{d:'24',m:'Apr',t:'Final Visit Before Leave'},{d:'10',m:'Apr',t:'Monthly Check'}] },
    { name:'Ngozi Anyanwu', gender:'Female', age:45, dob:'3 Oct 1980', phone:'+234 808 888 9999', email:'ngozi@email.com', address:'Magodo, Lagos', service:'Post-Discharge Recovery', plan:'6-Week Recovery (Completed)', since:'1 Dec 2025', visits:24, total:24, condition:'Post-hysterectomy recovery — COMPLETED', allergies:'Penicillin', medications:'Discharged — no current medications', emergency:'Emeka Anyanwu (Husband) — +234 800 888 7777', notes:'Full recovery. Self-management plan given. No further visits needed.', history:[{d:'20',m:'Apr',t:'Final Discharge Visit'},{d:'14',m:'Apr',t:'Pre-discharge Check'},{d:'7',m:'Apr',t:'Recovery Assessment'}] },
  ];
 
  function openPatient(i) {
    const p = patients[i];
    document.getElementById('modalName').textContent = p.name;
    document.getElementById('modalBody').innerHTML = `
      <div class="modal-section"><h4>Personal Details</h4>
        <div class="detail-row"><span class="detail-label">Full Name</span><span class="detail-value">${p.name}</span></div>
        <div class="detail-row"><span class="detail-label">Gender / Age</span><span class="detail-value">${p.gender}, ${p.age} years old</span></div>
        <div class="detail-row"><span class="detail-label">Date of Birth</span><span class="detail-value">${p.dob}</span></div>
        <div class="detail-row"><span class="detail-label">Phone</span><span class="detail-value">${p.phone}</span></div>
        <div class="detail-row"><span class="detail-label">Email</span><span class="detail-value">${p.email}</span></div>
        <div class="detail-row"><span class="detail-label">Address</span><span class="detail-value">${p.address}</span></div>
        <div class="detail-row"><span class="detail-label">Emergency Contact</span><span class="detail-value">${p.emergency}</span></div>
      </div>
      <div class="modal-section"><h4>Medical & Care</h4>
        <div class="detail-row"><span class="detail-label">Condition</span><span class="detail-value">${p.condition}</span></div>
        <div class="detail-row"><span class="detail-label">Allergies</span><span class="detail-value">${p.allergies}</span></div>
        <div class="detail-row"><span class="detail-label">Medications</span><span class="detail-value">${p.medications}</span></div>
        <div class="detail-row"><span class="detail-label">Service</span><span class="detail-value">${p.service}</span></div>
        <div class="detail-row"><span class="detail-label">Plan</span><span class="detail-value">${p.plan}</span></div>
        <div class="detail-row"><span class="detail-label">Patient Since</span><span class="detail-value">${p.since}</span></div>
        <div class="detail-row"><span class="detail-label">Visits</span><span class="detail-value">${p.visits}${p.total ? ' of ' + p.total : ' completed'}</span></div>
      </div>
      <div class="modal-section"><h4>Care Notes</h4>
        <p style="font-size:13px;color:#5a6690;line-height:1.65;">${p.notes}</p>
      </div>
      <div class="modal-section"><h4>Recent Visit History</h4>
        ${p.history.map(h => `<div class="visit-history-item"><div class="vh-date"><div class="vd">${h.d}</div><div class="vm">${h.m}</div></div><div class="vh-info"><strong>${h.t}</strong>Completed by Nurse Blessing Adeyemi</div></div>`).join('')}
      </div>
    `;
    document.getElementById('patientModal').classList.add('open');
  }
 
  function filterPatients(val) {
    val = val.toLowerCase();
    document.querySelectorAll('.patient-card').forEach(c => {
      c.style.display = c.innerText.toLowerCase().includes(val) ? '' : 'none';
    });
  }
  function filterByService(val) {
    document.querySelectorAll('.patient-card').forEach(c => {
      c.style.display = (!val || c.dataset.service === val) ? '' : 'none';
    });
  }
  function filterByStatus(val) {
    document.querySelectorAll('.patient-card').forEach(c => {
      c.style.display = (!val || c.dataset.status === val) ? '' : 'none';
    });
  }
 
  document.getElementById('patientModal').addEventListener('click', e => {
    if (e.target === document.getElementById('patientModal')) document.getElementById('patientModal').classList.remove('open');
  });

   function logout() {
    localStorage.removeItem('dh_user');
    window.location.href = '../../login.html';
  }