const user = JSON.parse(localStorage.getItem('dh_user') || '{}');
  if (!user.loggedIn || user.role !== 'ADMIN') window.location.href = 'login.html';
  function logout() { localStorage.removeItem('dh_user'); window.location.href = 'login.html'; }

  let patientsCache = [];

  async function loadPatients() {
  const grid = document.getElementById("patientsGrid");

  grid.innerHTML = `<p>Loading patients...</p>`;

  try {
    const user = JSON.parse(localStorage.getItem("dh_user"));

    if (!user || !user.token || user.role !== "ADMIN") {
      window.location.href = "../../login.html";
      return;
    }

    const res = await fetch(
      "https://digihealth-2795.onrender.com/api/admin/care-requests?status=ASSIGNED",
      {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
    );

    if (!res.ok) {
      grid.innerHTML = `<p>Error loading patients</p>`;
      return;
    }

    const patients = await res.json();
    patientsCache = patients || [];

    if (!patients.length) {
      grid.innerHTML = `<p>No patients found</p>`;
      return;
    }

    grid.innerHTML = "";

    patients.forEach(patient => {

      const initials = getInitials(patient.fullName);

      const card = document.createElement("div");
      card.className = "patient-card";

      card.innerHTML = `
        <div class="pc-top">

          <div class="pc-avatar">
            ${initials}
          </div>

          <div class="pc-info">
            <h3>${patient.fullName}</h3>
            <p>
              Patient since ${formatMonth(patient.createdAt)}
            </p>
          </div>

          <div class = "pc-status"> <span class="badge badge-active ${getStatusClass(patient.status)}">
            ● ${patient.status || "Active"}
          </span></div>
        </div>

        <div class="pc-details">
          <div class="pc-detail"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> ${patient.serviceNeeded || "N/A"}</div>
          <div class="pc-detail"><svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> ${patient.locationArea || "N/A"}</div>
          <div class="pc-detail"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> ${patient.assignedProviderName || "Unassigned"}</div>
          <div class="pc-detail"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> ${patient.nextVisit || "No visit scheduled"}</div>
        </div>

        <div class="pc-footer">
          <button class="pc-btn pc-btn-view" onclick="viewPatient('${patient.id}')">
            View Profile
          </button>

          <button class="pc-btn pc-btn-contact">
            Contact
          </button>
        </div>
      `;

      grid.appendChild(card);
    });

  } catch (err) {
    console.error(err);

    grid.innerHTML = `<p>Network error</p>`;
  }
}

/* =========================
   HELPERS
========================= */

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

  function viewPatient(id) {

  // Find patient from API cache
  const p = patientsCache.find(
    r => r.id == id
  );

  if (!p) {
    alert("Patient not found");
    return;
  }

  document.getElementById("modalPatientName").textContent =
    p.fullName || "Patient";

  document.getElementById("modalPatientBody").innerHTML = `

    <div class="modal-section">
      <h4>Personal</h4>

      <div class="detail-row">
        <span class="detail-label">Full Name</span>
        <span class="detail-value">
          ${p.fullName || "-"}
        </span>
      </div>

      <div class="detail-row">
        <span class="detail-label">Date of Birth</span>
        <span class="detail-value">
          ${p.dateOfBirth || "-"}
        </span>
      </div>

      <div class="detail-row">
        <span class="detail-label">Phone</span>
        <span class="detail-value">
          ${p.phoneNumber || "-"}
        </span>
      </div>

      <div class="detail-row">
        <span class="detail-label">Email</span>
        <span class="detail-value">
          ${p.email || "-"}
        </span>
      </div>

      <div class="detail-row">
        <span class="detail-label">Location</span>
        <span class="detail-value">
          ${p.locationArea || "-"}
        </span>
      </div>
    </div>

    <div class="modal-section">
      <h4>Care Details</h4>

      <div class="detail-row">
        <span class="detail-label">Service</span>
        <span class="detail-value">
          ${p.serviceNeeded || "-"}
        </span>
      </div>

      <div class="detail-row">
        <span class="detail-label">Caregiver</span>
        <span class="detail-value">
          ${p.assignedProviderName || "Unassigned"}
        </span>
      </div>

      <div class="detail-row">
        <span class="detail-label">Patient Since</span>
        <span class="detail-value">
          ${p.submittedAt  || "-"}
        </span>
      </div>

      <div class="detail-row">
        <span class="detail-label">Next Visit</span>
        <span class="detail-value">
          ${p.nextVisit || "Not scheduled"}
        </span>
      </div>

      <div class="detail-row">
        <span class="detail-label">Total Visits</span>
        <span class="detail-value">
          ${p.totalVisits || 0}
        </span>
      </div>

      <div class="detail-row">
        <span class="detail-label">Status</span>
        <span class="detail-value">
          ${p.status || "-"}
        </span>
      </div>

      <div class="detail-row">
        <span class="detail-label">Notes</span>
        <span class="detail-value">
          ${p.notes || "No notes"}
        </span>
      </div>
    </div>
  `;

  document
    .getElementById("patientModal")
    .classList
    .add("open");
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

    /* =========================
    INIT
  ========================= */

  document.addEventListener("DOMContentLoaded", () => {
    loadPatients();
  });

  function logout() {
   localStorage.removeItem('dh_user');
   window.location.href = '../../../login.html';
  }