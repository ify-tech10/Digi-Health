const user = JSON.parse(localStorage.getItem('dh_user') || '{}');
  if (!user.loggedIn || user.role !== 'admin') window.location.href = 'login.html';
  function logout() { localStorage.removeItem('dh_user'); window.location.href = 'login.html'; }

  const patients = [
    { name:'Amara Osei', email:'amara@email.com', phone:'+234 801 111 2222', dob:'12 Mar 1985', location:'Egbeda, Lagos', service:'Post-Discharge Recovery', caregiver:'Nurse Blessing Adeyemi', since:'2 Apr 2026', nextVisit:'Tue, 29 Apr 2026', visits:12, status:'Active', notes:'Post-appendectomy recovery. Progress on track.' },
    { name:'Emeka Nwachukwu', email:'emeka@email.com', phone:'+234 802 222 3333', dob:'4 Jun 1972', location:'Surulere, Lagos', service:'Chronic Care Management', caregiver:'Nurse Kemi Ojo', since:'15 Mar 2026', nextVisit:'Mon, 28 Apr 2026', visits:18, status:'Active', notes:'Type 2 diabetic. HbA1c improving.' },
    { name:'Grace Okonkwo', email:'grace@email.com', phone:'+234 803 333 4444', dob:'29 Aug 1948', location:'Yaba, Lagos', service:'Elderly Care Support', caregiver:'Nurse Blessing Adeyemi', since:'1 Feb 2026', nextVisit:'Mon, 28 Apr 2026', visits:34, status:'Active', notes:'Daily visits. Mobility support ongoing.' },
    { name:'Fatima Kabir', email:'fatima@email.com', phone:'+234 804 444 5555', dob:'11 Jan 1998', location:'Ikeja, Lagos', service:'Postnatal Mother & Baby', caregiver:'Nurse Amina Eze', since:'25 Apr 2026', nextVisit:'Wed, 30 Apr 2026', visits:2, status:'New', notes:'First-time mother. 2-week starter plan.' },
    { name:'Chukwuemeka Uche', email:'chukwu@email.com', phone:'+234 805 555 6666', dob:'7 May 1963', location:'Gbagada, Lagos', service:'Chronic Care Management', caregiver:'Unassigned', since:'10 Jan 2026', nextVisit:'None', visits:8, status:'On Hold', notes:'Patient travelling. Resumes May 5.' },
    { name:'Ngozi Anyanwu', email:'ngozi@email.com', phone:'+234 806 666 7777', dob:'3 Oct 1980', location:'Magodo, Lagos', service:'Post-Discharge Recovery', caregiver:'Nurse Blessing Adeyemi', since:'1 Dec 2025', nextVisit:'Completed', visits:24, status:'Completed', notes:'Full recovery achieved. Discharged Apr 20.' },
  ];

  function openPatient(i) {
    const p = patients[i];
    document.getElementById('modalPatientName').textContent = p.name;
    document.getElementById('modalPatientBody').innerHTML = `
      <div class="modal-section"><h4>Personal</h4>
        <div class="detail-row"><span class="detail-label">Full Name</span><span class="detail-value">${p.name}</span></div>
        <div class="detail-row"><span class="detail-label">Date of Birth</span><span class="detail-value">${p.dob}</span></div>
        <div class="detail-row"><span class="detail-label">Phone</span><span class="detail-value">${p.phone}</span></div>
        <div class="detail-row"><span class="detail-label">Email</span><span class="detail-value">${p.email}</span></div>
        <div class="detail-row"><span class="detail-label">Location</span><span class="detail-value">${p.location}</span></div>
      </div>
      <div class="modal-section"><h4>Care Details</h4>
        <div class="detail-row"><span class="detail-label">Service</span><span class="detail-value">${p.service}</span></div>
        <div class="detail-row"><span class="detail-label">Caregiver</span><span class="detail-value">${p.caregiver}</span></div>
        <div class="detail-row"><span class="detail-label">Patient Since</span><span class="detail-value">${p.since}</span></div>
        <div class="detail-row"><span class="detail-label">Next Visit</span><span class="detail-value">${p.nextVisit}</span></div>
        <div class="detail-row"><span class="detail-label">Total Visits</span><span class="detail-value">${p.visits}</span></div>
        <div class="detail-row"><span class="detail-label">Status</span><span class="detail-value">${p.status}</span></div>
        <div class="detail-row"><span class="detail-label">Notes</span><span class="detail-value">${p.notes}</span></div>
      </div>
    `;
    document.getElementById('patientModal').classList.add('open');
  }

  function filterCards(val) {
    val = val.toLowerCase();
    document.querySelectorAll('.patient-card').forEach(c => {
      c.style.display = c.innerText.toLowerCase().includes(val) ? '' : 'none';
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
   window.location.href = '../../../login.html';
  }