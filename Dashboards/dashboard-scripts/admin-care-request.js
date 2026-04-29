const user = JSON.parse(localStorage.getItem('dh_user') || '{}');
  if (!user.loggedIn || user.role !== 'admin') window.location.href = 'login.html';
  function logout() { localStorage.removeItem('dh_user'); window.location.href = 'login.html'; }

  const requests = [
    { patient: 'Adaeze Onyekwere', email: 'adaeze@email.com', phone: '+234 801 234 5678', service: 'Post-Discharge Recovery', location: 'Lekki, Lagos', received: 'Today, 7:42 AM', status: 'Urgent', description: 'Patient discharged from Lagos Island Hospital after appendectomy. Needs daily wound care and medication monitoring.', preferred: 'Morning (6AM – 12PM)' },
    { patient: 'Rotimi Fadahunsi', email: 'rotimi@email.com', phone: '+234 802 345 6789', service: 'Elderly Care Support', location: 'Ikeja, Lagos', received: 'Today, 6:18 AM', status: 'New', description: '78-year-old father living alone. Family requests daily check-ins, mobility support, and medication reminders.', preferred: 'Morning (6AM – 12PM)' },
    { patient: 'Chidinma Okafor', email: 'chidinma@email.com', phone: '+234 803 456 7890', service: 'Postnatal Mother & Baby', location: 'Surulere, Lagos', received: 'Yesterday, 11:55 PM', status: 'New', description: 'First-time mother, delivered 48 hours ago. Needs breastfeeding guidance and newborn health monitoring.', preferred: 'Afternoon (12PM – 5PM)' },
    { patient: 'Kunle Adesanya', email: 'kunle@email.com', phone: '+234 804 567 8901', service: 'Chronic Care Management', location: 'Yaba, Lagos', received: 'Yesterday, 4:30 PM', status: 'Assigned', description: 'Type 2 diabetic. Needs weekly blood sugar monitoring and lifestyle guidance. Currently assigned to Nurse Kemi Ojo.', preferred: 'Flexible' },
    { patient: 'Sade Coker', email: 'sade@email.com', phone: '+234 805 678 9012', service: 'Home Nursing Care', location: 'Victoria Island, Lagos', received: 'Yesterday, 2:10 PM', status: 'Assigned', description: 'Post-surgical wound care needed 3x weekly. Assigned to Nurse Blessing Adeyemi.', preferred: 'Morning (6AM – 12PM)' },
    { patient: 'Ibrahim Musa', email: 'ibrahim@email.com', phone: '+234 806 789 0123', service: 'Lab & Diagnostic Services', location: 'Gbagada, Lagos', received: '26 Apr, 9:00 AM', status: 'Pending', description: 'Needs blood panel and HbA1c test done at home. Doctor referred.', preferred: 'Morning (6AM – 12PM)' },
    { patient: 'Ngozi Obiechina', email: 'ngozi@email.com', phone: '+234 807 890 1234', service: 'Physiotherapy & Rehab', location: 'Magodo, Lagos', received: '26 Apr, 8:15 AM', status: 'Pending', description: 'Stroke rehabilitation — needs 3 sessions per week. Partial right-side weakness.', preferred: 'Afternoon (12PM – 5PM)' },
  ];

  let currentTab = 'all';
  let assignPatient = '';

  function setTab(el, tab) {
    currentTab = tab;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    filterTable();
  }

  function filterTable() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const statusF = document.getElementById('statusFilter').value.toLowerCase();
    const serviceF = document.getElementById('serviceFilter').value.toLowerCase();
    const rows = document.querySelectorAll('#tableBody tr');
    let count = 0;
    rows.forEach(row => {
      const status = row.dataset.status;
      const service = row.dataset.service.toLowerCase();
      const text = row.innerText.toLowerCase();
      let show = text.includes(search);
      if (statusF && status !== statusF) show = false;
      if (serviceF && !service.includes(serviceF)) show = false;
      if (currentTab === 'unassigned' && (status === 'assigned')) show = false;
      if (currentTab === 'assigned' && status !== 'assigned') show = false;
      if (currentTab === 'completed' && status !== 'done') show = false;
      row.style.display = show ? '' : 'none';
      if (show) count++;
    });
    document.getElementById('rowCount').textContent = count + ' request' + (count !== 1 ? 's' : '');
  }

  function openView(i) {
    const r = requests[i];
    document.getElementById('viewModalBody').innerHTML = `
      <div class="detail-row"><span class="detail-label">Patient</span><span class="detail-value">${r.patient}</span></div>
      <div class="detail-row"><span class="detail-label">Email</span><span class="detail-value">${r.email}</span></div>
      <div class="detail-row"><span class="detail-label">Phone</span><span class="detail-value">${r.phone}</span></div>
      <div class="detail-row"><span class="detail-label">Service</span><span class="detail-value">${r.service}</span></div>
      <div class="detail-row"><span class="detail-label">Location</span><span class="detail-value">${r.location}</span></div>
      <div class="detail-row"><span class="detail-label">Received</span><span class="detail-value">${r.received}</span></div>
      <div class="detail-row"><span class="detail-label">Status</span><span class="detail-value">${r.status}</span></div>
      <div class="detail-row"><span class="detail-label">Preferred Time</span><span class="detail-value">${r.preferred}</span></div>
      <div class="detail-row"><span class="detail-label">Description</span><span class="detail-value">${r.description}</span></div>
    `;
    document.getElementById('viewModal').classList.add('open');
  }

  function openAssign(name) {
    assignPatient = name;
    document.getElementById('assignTitle').textContent = 'Assign Service provider — ' + name;
    document.getElementById('caregiverSelect').selectedIndex = 0;
    document.getElementById('assignModal').classList.add('open');
  }

  function confirmAssign() {
    const sel = document.getElementById('caregiverSelect');
    if (!sel.value) { alert('Please select a caregiver.'); return; }
    alert(`✅ ${assignPatient} has been assigned to ${sel.value.split('—')[0].trim()}`);
    closeModal('assignModal');
  }

  function closeModal(id) { document.getElementById(id).classList.remove('open'); }

  function exportCSV() {
    const rows = [['Patient','Service','Location','Received','Status']];
    requests.forEach(r => rows.push([r.patient, r.service, r.location, r.received, r.status]));
    const csv = rows.map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv,' + encodeURIComponent(csv);
    a.download = 'care-requests.csv';
    a.click();
  }

  document.querySelectorAll('.modal-overlay').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
  });

    function logout() {
   localStorage.removeItem('dh_user');
   window.location.href = '../../../login.html';
  }