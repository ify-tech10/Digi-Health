 const user = JSON.parse(localStorage.getItem('dh_user') || '{}');
  /*if (!user.loggedIn || user.role !== 'caregiver') window.location.href = 'login.html';
  function logout() { localStorage.removeItem('dh_user'); window.location.href = 'login.html'; }*/
 
  // ── STATE ──
  const today = new Date();
  let viewYear = today.getFullYear();
  let viewMonth = today.getMonth(); // 0-indexed
 
  // dayData: key = 'YYYY-MM-DD', value = { status, slots, note }
  let dayData = {};
 
  // Booked days (from schedule — simulated)
  const bookedDays = [
    formatKey(today.getFullYear(), today.getMonth(), today.getDate()),
    formatKey(today.getFullYear(), today.getMonth(), today.getDate() + 2),
    formatKey(today.getFullYear(), today.getMonth(), today.getDate() + 5),
  ];
 
  // Editing state
  let selectedKey = null;
  let editorStatus = null;
  let editorSlots = [];
 
  // Default working days (0=Sun ... 6=Sat)
  const defaultWorkDays = { 0:false, 1:true, 2:true, 3:true, 4:true, 5:true, 6:false };
 
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const SHORT_DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
 
  function formatKey(y, m, d) {
    return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  }
 
  // ── RENDER CALENDAR ──
  function renderCalendar() {
    document.getElementById('calMonthLabel').textContent = MONTHS[viewMonth] + ' ' + viewYear;
 
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const todayKey = formatKey(today.getFullYear(), today.getMonth(), today.getDate());
 
    const grid = document.getElementById('calGrid');
    grid.innerHTML = '';
 
    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('div');
      empty.className = 'cal-day cal-day-empty';
      grid.appendChild(empty);
    }
 
    for (let d = 1; d <= daysInMonth; d++) {
      const key = formatKey(viewYear, viewMonth, d);
      const dateObj = new Date(viewYear, viewMonth, d);
      const isPast = dateObj < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isToday = key === todayKey;
      const isBooked = bookedDays.includes(key);
      const data = dayData[key];
      const status = isBooked ? 'booked' : (data ? data.status : null);
 
      const cell = document.createElement('div');
      cell.className = 'cal-day';
      if (isPast) cell.classList.add('cal-day-past');
      if (isToday) cell.classList.add('cal-day-today');
      if (!isToday) {
        if (status === 'available') cell.classList.add('cal-day-available');
        else if (status === 'unavailable') cell.classList.add('cal-day-unavailable');
        else if (status === 'partial') cell.classList.add('cal-day-partial');
        else if (status === 'booked') cell.classList.add('cal-day-booked');
      }
      if (key === selectedKey && !isToday) cell.style.outline = '2px solid var(--navy)';
 
      let dotClass = '';
      if (!isToday) {
        if (status === 'available') dotClass = 'day-dot-green';
        else if (status === 'unavailable') dotClass = 'day-dot-red';
        else if (status === 'partial') dotClass = 'day-dot-orange';
        else if (status === 'booked') dotClass = 'day-dot-blue';
      }
 
      const slots = data?.slots?.length ? data.slots.length + ' slot' + (data.slots.length !== 1 ? 's' : '') : '';
 
      cell.innerHTML = `
        <div class="day-num">${d}</div>
        ${dotClass ? `<div class="day-dot ${dotClass}"></div>` : ''}
        ${slots && status !== 'booked' ? `<div class="day-slots">${slots}</div>` : ''}
      `;
 
      if (!isPast) {
        cell.addEventListener('click', () => selectDay(key, d));
      }
 
      grid.appendChild(cell);
    }
 
    updateSummary();
  }
 
  // ── SELECT DAY ──
  function selectDay(key, d) {
    selectedKey = key;
    const dateObj = new Date(viewYear, viewMonth, d);
    const dayName = DAYS[dateObj.getDay()];
    const dateStr = `${dayName}, ${d} ${MONTHS[viewMonth]} ${viewYear}`;
 
    document.getElementById('detailSubtitle').textContent = dateStr;
    document.getElementById('editorDateLabel').textContent = dateStr;
    document.getElementById('noDaySelected').style.display = 'none';
    document.getElementById('dayEditor').style.display = 'block';
 
    const isBooked = bookedDays.includes(key);
    const data = dayData[key];
 
    if (isBooked) {
      editorStatus = 'booked';
      document.getElementById('editorStatusLabel').textContent = '📅 Visit Booked — cannot change';
      document.querySelectorAll('.status-option').forEach(o => o.style.opacity = '0.4');
      document.getElementById('timeSlotsSection').style.display = 'none';
      document.getElementById('dayNote').disabled = true;
    } else {
      document.querySelectorAll('.status-option').forEach(o => { o.style.opacity = '1'; o.classList.remove('selected'); });
      document.getElementById('dayNote').disabled = false;
      editorStatus = data?.status || null;
      editorSlots = data?.slots ? [...data.slots] : [];
      document.getElementById('dayNote').value = data?.note || '';
 
      // Update status label
      updateEditorStatusLabel();
 
      // Highlight selected option
      if (editorStatus) {
        const optMap = { available:'opt-available', partial:'opt-partial', unavailable:'opt-unavailable' };
        if (optMap[editorStatus]) document.getElementById(optMap[editorStatus]).classList.add('selected');
      }
 
      // Show/hide time slots
      document.getElementById('timeSlotsSection').style.display =
        (editorStatus === 'available' || editorStatus === 'partial') ? 'block' : 'none';
 
      // Render slots
      document.querySelectorAll('.time-slot').forEach(s => {
        s.classList.toggle('selected', editorSlots.includes(s.dataset.slot));
      });
    }
 
    renderCalendar();
  }
 
  function updateEditorStatusLabel() {
    const labels = { available:'✓ Available', partial:'⚡ Partial Day', unavailable:'✕ Unavailable', null:'Not set' };
    document.getElementById('editorStatusLabel').textContent = labels[editorStatus] || 'Not set';
  }
 
  // ── SET DAY STATUS ──
  function setDayStatus(status) {
    editorStatus = status;
    document.querySelectorAll('.status-option').forEach(o => o.classList.remove('selected'));
    const optMap = { available:'opt-available', partial:'opt-partial', unavailable:'opt-unavailable' };
    if (optMap[status]) document.getElementById(optMap[status]).classList.add('selected');
    document.getElementById('timeSlotsSection').style.display =
      (status === 'available' || status === 'partial') ? 'block' : 'none';
    if (status === 'unavailable') {
      editorSlots = [];
      document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
    }
    updateEditorStatusLabel();
  }
 
  // ── TOGGLE SLOT ──
  function toggleSlot(el) {
    const slot = el.dataset.slot;
    if (el.classList.contains('booked')) return;
    if (editorSlots.includes(slot)) {
      editorSlots = editorSlots.filter(s => s !== slot);
      el.classList.remove('selected');
    } else {
      editorSlots.push(slot);
      el.classList.add('selected');
    }
  }
 
  // ── APPLY DAY ──
  function applyDaySettings() {
    if (!selectedKey || bookedDays.includes(selectedKey)) return;
    if (!editorStatus) { showToast('Please select an availability status first.', false); return; }
    dayData[selectedKey] = {
      status: editorStatus,
      slots: [...editorSlots],
      note: document.getElementById('dayNote').value.trim()
    };
    renderCalendar();
    showToast('Day updated!', true);
  }
 
  // ── BULK SET ──
  function bulkSet(action) {
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const todayFull = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(viewYear, viewMonth, d);
      if (dateObj < todayFull) continue;
      const key = formatKey(viewYear, viewMonth, d);
      if (bookedDays.includes(key)) continue;
      const dow = dateObj.getDay();
      if (action === 'available' && dow >= 1 && dow <= 5) {
        dayData[key] = { status:'available', slots:['9AM-12PM','12PM-3PM','3PM-6PM'], note:'' };
      } else if (action === 'unavailable' && (dow === 0 || dow === 6)) {
        dayData[key] = { status:'unavailable', slots:[], note:'' };
      } else if (action === 'clear') {
        delete dayData[key];
      }
    }
    renderCalendar();
    const msgs = { available:'Weekdays set to available!', unavailable:'Weekends marked unavailable!', clear:'All days cleared!' };
    showToast(msgs[action], true);
  }
 
  // ── SAVE ──
  function saveAvailability() {
    // In production this would POST to an API
    // Store in localStorage for demo
    const key = `dh_availability_${viewYear}_${viewMonth}`;
    localStorage.setItem(key, JSON.stringify(dayData));
    showToast('Schedule saved successfully!', true);
  }
 
  // ── CHANGE MONTH ──
  function changeMonth(dir) {
    // Save current before switching
    const key = `dh_availability_${viewYear}_${viewMonth}`;
    localStorage.setItem(key, JSON.stringify(dayData));
 
    viewMonth += dir;
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
 
    // Load saved data for new month
    const saved = localStorage.getItem(`dh_availability_${viewYear}_${viewMonth}`);
    dayData = saved ? JSON.parse(saved) : {};
    selectedKey = null;
    document.getElementById('noDaySelected').style.display = 'block';
    document.getElementById('dayEditor').style.display = 'none';
    document.getElementById('detailSubtitle').textContent = 'Click any day on the calendar to set availability';
    renderCalendar();
  }
 
  // ── SUMMARY ──
  function updateSummary() {
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    let avail = 0, partial = 0, unavail = 0, booked = 0, unset = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const key = formatKey(viewYear, viewMonth, d);
      if (bookedDays.includes(key)) { booked++; continue; }
      const data = dayData[key];
      if (!data) unset++;
      else if (data.status === 'available') avail++;
      else if (data.status === 'partial') partial++;
      else if (data.status === 'unavailable') unavail++;
    }
    document.getElementById('sumAvailable').textContent = avail;
    document.getElementById('sumPartial').textContent = partial;
    document.getElementById('sumUnavailable').textContent = unavail;
    document.getElementById('sumBooked').textContent = booked;
    document.getElementById('sumUnset').textContent = unset;
  }
 
  // ── WORKING DAYS ──
  function renderWorkingDays() {
    const wrap = document.getElementById('workingDaysWrap');
    wrap.innerHTML = SHORT_DAYS.map((day, i) => `
      <div class="wh-row">
        <div class="wh-day">${day}</div>
        <div class="wh-time" id="wh-time-${i}">${defaultWorkDays[i] ? '8:00 AM – 6:00 PM' : 'Off'}</div>
        <label class="wh-toggle">
          <input type="checkbox" ${defaultWorkDays[i] ? 'checked' : ''} onchange="toggleWorkDay(${i}, this.checked)" />
          <span class="wh-slider"></span>
        </label>
      </div>
    `).join('');
  }
 
  function toggleWorkDay(i, checked) {
    defaultWorkDays[i] = checked;
    document.getElementById('wh-time-' + i).textContent = checked ? '8:00 AM – 6:00 PM' : 'Off';
  }
 
  // ── TOAST ──
  function showToast(msg, success = true) {
    const t = document.getElementById('toast');
    const icon = t.querySelector('svg');
    document.getElementById('toastMsg').textContent = msg;
    icon.style.display = success ? 'block' : 'none';
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2800);
  }
 
  // ── INIT ──
  // Load any saved data
  const savedData = localStorage.getItem(`dh_availability_${viewYear}_${viewMonth}`);
  if (savedData) dayData = JSON.parse(savedData);
 
  // Pre-fill some demo data for current month
  if (!savedData) {
    const d = today.getDate();
    const m = today.getMonth();
    const y = today.getFullYear();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      const dateObj = new Date(y, m, i);
      const dow = dateObj.getDay();
      const key = formatKey(y, m, i);
      if (bookedDays.includes(key)) continue;
      if (dow >= 1 && dow <= 5 && i >= d) {
        dayData[key] = { status: 'available', slots: ['9AM-12PM','12PM-3PM','3PM-6PM'], note: '' };
      } else if ((dow === 0 || dow === 6) && i >= d) {
        dayData[key] = { status: 'unavailable', slots: [], note: '' };
      }
    }
  }
 
  renderCalendar();
  renderWorkingDays();