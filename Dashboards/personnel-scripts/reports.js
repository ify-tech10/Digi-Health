const user = JSON.parse(localStorage.getItem('dh_user') || '{}');
  /*if (!user.loggedIn || (user.role !== 'SERVICE_PROVIDER' && user.role !== 'CLINICAL_PERSONNEL')) window.location.href = 'login.html';
  function logout() { localStorage.removeItem('dh_user'); window.location.href = 'login.html'; }*/
 
  // Set today's date as default
  document.getElementById('vr_date').value = new Date().toISOString().split('T')[0];
 
  const reports = [
    { patient:'Amara Osei', date:'22 Apr 2026', service:'Post-Discharge Recovery', location:'Egbeda, Lagos', time:'8:30 AM – 9:45 AM', bp:'128/82', hr:'76', temp:'36.5', spo2:'98', sugar:'—', weight:'62', activities:'Wound dressing, Medication administration, Vital signs monitoring', meds:'Amlodipine 5mg — confirmed taken, Metronidazole 400mg — confirmed taken', observations:'Wound healing well. No signs of infection. Slight redness at the edges — monitored. Patient alert and communicative. Pain level 2/10.', condition:'Improving — on track', followup:'Continue current medication. Change dressing every 2 days. Elevate affected area. Next visit 25 Apr.', escalation:'None', sig:'Nurse Blessing Adeyemi' },
    { patient:'Emeka Nwachukwu', date:'21 Apr 2026', service:'Chronic Care Management', location:'Surulere, Lagos', time:'11:00 AM – 12:15 PM', bp:'132/84', hr:'80', temp:'36.8', spo2:'97', sugar:'6.1', weight:'88', activities:'Vital signs monitoring, Medication administration, Patient education, Family education', meds:'Metformin 500mg, Lisinopril 10mg', observations:'Blood sugar 6.1 — improved from 7.4 last visit. Patient reports reduced sugar intake. Family actively supporting diet plan. Feet inspected — no ulcers.', condition:'Improving — on track', followup:'Continue low-carb diet. Monitor blood sugar daily. Family to log readings. Next visit 25 Apr.', escalation:'None', sig:'Nurse Blessing Adeyemi' },
    { patient:'Grace Okonkwo', date:'21 Apr 2026', service:'Elderly Care Support', location:'Yaba, Lagos', time:'2:00 PM – 3:00 PM', bp:'126/80', hr:'72', temp:'36.7', spo2:'99', sugar:'—', weight:'58', activities:'Vital signs monitoring, Mobility support, Medication administration, Emotional support', meds:'Amlodipine 2.5mg', observations:'Patient in good spirits. Completed 10 minutes of mobility exercises with assistance. No pain reported. Good appetite. Sleeping well.', condition:'Stable — no change', followup:'Continue daily visits. Increase mobility exercise to 15 minutes next visit.', escalation:'None', sig:'Nurse Blessing Adeyemi' },
    { patient:'Fatima Kabir', date:'26 Apr 2026', service:'Postnatal Mother & Baby Care', location:'Ikeja, Lagos', time:'9:30 AM – 10:45 AM', bp:'118/76', hr:'74', temp:'36.8', spo2:'99', sugar:'—', weight:'68', activities:'Breastfeeding support, Family education, Vital signs monitoring, Emotional support', meds:'Folic acid, Iron supplement', observations:'Baby weight 3.1kg — gaining adequately. Breastfeeding latch improving significantly. Mother\'s wound healing well. Mother anxious but receptive. Baby alert, feeding 8x/day.', condition:'Improving — on track', followup:'Continue breastfeeding on demand. Monitor baby weight at next visit. Mother to rest 8 hours per night.', escalation:'None', sig:'Nurse Blessing Adeyemi' },
    { patient:'Amara Osei', date:'19 Apr 2026', service:'Post-Discharge Recovery', location:'Egbeda, Lagos', time:'9:00 AM – 10:00 AM', bp:'134/86', hr:'78', temp:'36.6', spo2:'97', sugar:'—', weight:'62', activities:'Vital signs monitoring, Medication administration, Wound dressing', meds:'Amlodipine 5mg — dose reviewed', observations:'BP elevated at 134/86. Wound dressing changed. Mild swelling noted. Patient reported headache. Medication adjusted per care plan protocol.', condition:'Stable — no change', followup:'Monitor BP daily. Alert admin if BP exceeds 140/90. Patient to reduce salt intake.', escalation:'BP elevated — flagged to admin for review.', sig:'Nurse Blessing Adeyemi' },
  ];
 
  function openReport(i) {
    const r = reports[i];
    document.getElementById('modalReportTitle').textContent = r.patient + ' — ' + r.date;
    document.getElementById('modalReportBody').innerHTML = `
      <div class="modal-section"><h4>Visit Information</h4>
        <div class="detail-row"><span class="detail-label">Patient</span><span class="detail-value">${r.patient}</span></div>
        <div class="detail-row"><span class="detail-label">Date</span><span class="detail-value">${r.date}</span></div>
        <div class="detail-row"><span class="detail-label">Time</span><span class="detail-value">${r.time}</span></div>
        <div class="detail-row"><span class="detail-label">Service</span><span class="detail-value">${r.service}</span></div>
        <div class="detail-row"><span class="detail-label">Location</span><span class="detail-value">${r.location}</span></div>
      </div>
      <div class="modal-section"><h4>Vital Signs</h4>
        <div class="detail-row"><span class="detail-label">Blood Pressure</span><span class="detail-value">${r.bp} mmHg</span></div>
        <div class="detail-row"><span class="detail-label">Heart Rate</span><span class="detail-value">${r.hr} bpm</span></div>
        <div class="detail-row"><span class="detail-label">Temperature</span><span class="detail-value">${r.temp} °C</span></div>
        <div class="detail-row"><span class="detail-label">SpO₂</span><span class="detail-value">${r.spo2}%</span></div>
        <div class="detail-row"><span class="detail-label">Blood Sugar</span><span class="detail-value">${r.sugar}</span></div>
        <div class="detail-row"><span class="detail-label">Weight</span><span class="detail-value">${r.weight} kg</span></div>
      </div>
      <div class="modal-section"><h4>Care Provided</h4>
        <div class="detail-row"><span class="detail-label">Activities</span><span class="detail-value">${r.activities}</span></div>
        <div class="detail-row"><span class="detail-label">Medications</span><span class="detail-value">${r.meds}</span></div>
        <div class="detail-row"><span class="detail-label">Observations</span><span class="detail-value">${r.observations}</span></div>
      </div>
      <div class="modal-section"><h4>Assessment & Plan</h4>
        <div class="detail-row"><span class="detail-label">Condition</span><span class="detail-value">${r.condition}</span></div>
        <div class="detail-row"><span class="detail-label">Follow-up Plan</span><span class="detail-value">${r.followup}</span></div>
        <div class="detail-row"><span class="detail-label">Escalation</span><span class="detail-value">${r.escalation}</span></div>
        <div class="detail-row"><span class="detail-label">Signed by</span><span class="detail-value">${r.sig}</span></div>
      </div>
    `;
    document.getElementById('reportModal').classList.add('open');
  }
 
  function submitReport() {
    const patient = document.getElementById('vr_patient').value;
    const date = document.getElementById('vr_date').value;
    const obs = document.getElementById('vr_observations').value.trim();
    const sig = document.getElementById('vr_sig').value.trim();
    if (!patient || !date || !obs || !sig) {
      alert('Please fill in all required fields — patient, date, observations, and your signature.');
      return;
    }
    document.getElementById('successBanner').classList.add('show');
    document.getElementById('successBanner').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    // Reset form
    ['vr_patient','vr_service','vr_location','vr_bp','vr_hr','vr_temp','vr_spo2','vr_sugar','vr_weight','vr_meds','vr_observations','vr_condition','vr_next','vr_followup','vr_escalation','vr_sig','vr_confirm','vr_start','vr_end'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.tagName === 'SELECT' ? el.selectedIndex = 0 : el.value = ''; }
    });
    document.querySelectorAll('input[name="care_act"]').forEach(cb => cb.checked = false);
    document.getElementById('vr_date').value = new Date().toISOString().split('T')[0];
    setTimeout(() => document.getElementById('successBanner').classList.remove('show'), 4000);
  }
 
  function saveDraft() {
    alert('Draft saved. You can continue editing and submit when ready.');
  }
 
  function filterReports(val) {
    val = val.toLowerCase();
    document.querySelectorAll('.report-item').forEach(r => {
      r.style.display = r.innerText.toLowerCase().includes(val) ? '' : 'none';
    });
  }
 
  document.getElementById('reportModal').addEventListener('click', e => {
    if (e.target === document.getElementById('reportModal')) document.getElementById('reportModal').classList.remove('open');
  });

   function logout() {
    localStorage.removeItem('dh_user');
    window.location.href = '../../login.html';
  }