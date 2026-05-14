
  const user = JSON.parse(localStorage.getItem('dh_user') || '{}');
  if (!user.loggedIn || user.role !== 'ADMIN') window.location.href = 'login.html';
  function logout() { localStorage.removeItem('dh_user'); window.location.href = 'login.html'; }

  let personnelCache = [];

  async function loadPersonnel() {
  const grid = document.getElementById("personnelGrid");

  grid.innerHTML = `<p>Loading personnel...</p>`;

  try {
    const user = JSON.parse(localStorage.getItem("dh_user"));

    if (!user || !user.token) {
      window.location.href = "../../login.html";
      return;
    }

    const res = await fetch(
      "https://digihealth-6uy7.onrender.com/api/admin/providers?status=APPROVED",
      {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
    );

    if (!res.ok) {
      grid.innerHTML = `<p>Error loading personnel</p>`;
      return;
    }

    const personnel = await res.json();
    
    personnelCache = personnel || [];

    if (!personnel.length) {
      grid.innerHTML = `<p>No personnel found</p>`;
      return;
    }

    grid.innerHTML = "";

    personnel.forEach(personnel => {

      const initials = getInitials(personnel.fullName);

      const card = document.createElement("div");
      card.className = "personnel-card";

      card.innerHTML = `
        <div class="personnel-card" data-role="Registered Nurse" data-avail="available" onclick="openPersonnel('${personnel.id}')">
        <div class="pc-head">
          <div class="pc-avatar" style="background:#1a2550;">${getInitials(personnel.fullName)}</div>
          <div class="pc-meta"><h3>${personnel.fullName}</h3><p>${personnel.serviceProviderType}</p></div>
          <div class="pc-status-wrap"><span class="badge badge-active">${personnel.availabilityType}</span></div>
        </div>
        <div class="pc-stats">
          <div class="pc-stat"><div class="ps-val">8</div><div class="ps-lbl">Patients</div></div>
          <div class="pc-stat"><div class="ps-val">47</div><div class="ps-lbl">Visits</div></div>
        </div>
       <!-- <div class="workload-bar-wrap">
          <div class="workload-bar"><div class="workload-fill high" style="width:80%;"></div></div>
          <div class="workload-label">8/10 capacity</div>
        </div>-->
        <div class="pc-tags" style="margin-top:10px;">
          <span class="pc-tag">${personnel.areasOfSpecialisation}</span>
        </div>
        <div class="pc-footer">
          <button class="pc-btn pc-btn-view"onclick="openPersonnel('${personnel.id}')"  >View Profile</button>
          <button class="pc-btn pc-btn-assign">Assign</button>
        </div>
      </div>
      `;

      grid.appendChild(card);
    });

  } catch (err) {
    console.error(err);

    grid.innerHTML = `<p>Network error</p>`;
  }
}
function getInitials(name = "") {
  return name
    .split(" ")
    .map(n => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}
function formatMonth(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  return date.toLocaleDateString(undefined, {
    month: "short",
    year: "numeric"
  });
}
function getStatusClass(status = "") {

  switch (status.toLowerCase()) {

    case "active":
      return "status-active";

    case "new":
      return "status-new";

    case "completed":
      return "status-completed";

    case "on hold":
      return "status-hold";

    default:
      return "";
  }
}

  function openPersonnel(id) {

    const p = personnelCache.find(person => person.id == id);

    if (!p) {
    alert("Personnel not found");
    return;
    }
    
    document.getElementById('modalPersonnelBody').innerHTML = `
      <div class="modal-section"><h4>Personal & Contact</h4>
        <div class="detail-row"><span class="detail-label">Full Name</span><span class="detail-value">${p.fullName}</span></div>
        <div class="detail-row"><span class="detail-label">Role</span><span class="detail-value">${p.serviceProviderType}</span></div>
        <div class="detail-row"><span class="detail-label">Phone</span><span class="detail-value">${p.phoneNumber}</span></div>
        <div class="detail-row"><span class="detail-label">Email</span><span class="detail-value">${p.email}</span></div>
        <div class="detail-row"><span class="detail-label">Coverage Areas</span><span class="detail-value">${p.locationArea}</span></div>
        <div class="detail-row"><span class="detail-label">Joined</span><span class="detail-value">${p.reviewedAt}</span></div>
        <div class="detail-row"><span class="detail-label">Date of Birth</span><span class="detail-value">${p.dateOfBirth}</span></div>
      </div>
      <div class="modal-section"><h4>Professional</h4>
        <div class="detail-row"><span class="detail-label">Experience</span><span class="detail-value">${p.yearsOfExperience}</span></div>
        <div class="detail-row"><span class="detail-label">Qualification</span><span class="detail-value">${p.highestQualification}</span></div>
        <div class="detail-row"><span class="detail-label">Specialisations</span><span class="detail-value">${p.areasOfSpecialisation}</span></div>
        <div class="detail-row"><span class="detail-label">Availability</span><span class="detail-value">${p.availabilityType}</span></div>
        <div class="detail-row"><span class="detail-label">Status</span><span class="detail-value">${p.applicationStatus}</span></div>
      </div>
      <div class="modal-section"><h4>Performance</h4>
        <div class="detail-row"><span class="detail-label">Active Patients</span><span class="detail-value">${p.patients}</span></div>
        <div class="detail-row"><span class="detail-label">Total Visits</span><span class="detail-value">${p.visits}</span></div>
      </div>
    `;
    document.getElementById('personnelModal').classList.add('open');
  }

  function filterPersonnel(val) {
    val = val.toLowerCase();
    document.querySelectorAll('.personnel-card').forEach(c => {
      c.style.display = c.innerText.toLowerCase().includes(val) ? '' : 'none';
    });
  }
  function filterByRole(val) {
    document.querySelectorAll('.personnel-card').forEach(c => {
      c.style.display = (!val || c.dataset.role === val) ? '' : 'none';
    });
  }
  function filterByAvail(val) {
    document.querySelectorAll('.personnel-card').forEach(c => {
      c.style.display = (!val || c.dataset.avail === val) ? '' : 'none';
    });
  }
  document.getElementById('personnelModal').addEventListener('click', e => {
    if (e.target === document.getElementById('personnelModal')) document.getElementById('personnelModal').classList.remove('open');
  });
  function logout() { localStorage.removeItem('dh_user'); window.location.href = '../../../login.html'; }

   /* =========================
    INIT
  ========================= */

  document.addEventListener("DOMContentLoaded", () => {
    loadPersonnel();
  });

