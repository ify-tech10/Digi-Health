
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


  function openModal(id) {
  document.getElementById(id).classList.add("open");
}

function closeModal(id) {
  document.getElementById(id).classList.remove("open");
}


  function openPersonnelSelector() {
  openModal("personnelSelectorModal");
}

/* =========================
ADMIN
========================= */
function openAdminModal() {
  closeModal("personnelSelectorModal");
  openModal("adminModal");
}

/* =========================
RELATIONSHIP MANAGER
========================= */
function openRMModal() {
  closeModal("personnelSelectorModal");
  openModal("rmModal");
}

/* =========================
CLINICAL (Doctors/Nurses/Caregivers)
========================= */
function openClinicalModal() {
  closeModal("personnelSelectorModal");
  openModal("clinicalModal");
}

/* =========================
PATIENT
========================= */
function openPatientModal() {
  closeModal("personnelSelectorModal");
  openModal("patientModal");
}

/* =========================
CNO / MD
========================= */
function openCNOModal() {
  closeModal("personnelSelectorModal");
  openModal("cnoModal");
}

/* =========================
LAB SCIENTIST
========================= */
function openLabScientistModal() {
  closeModal("personnelSelectorModal");
  openModal("labScientistModal");
}

/* =========================
PHARMACIST
========================= */
function openPharmacistModal() {
  closeModal("personnelSelectorModal");
  openModal("pharmacistModal");
}

/* =========================
CUSTOMER CARE
========================= */
function openCustomerCareModal() {
  closeModal("personnelSelectorModal");
  openModal("customerCareModal");
}

/* =========================
FINANCE MANAGER
========================= */
function openFinanceModal() {
  closeModal("personnelSelectorModal");
  openModal("financeModal");
}


/* =========================================================
BASE API
========================================================= */

const API_BASE = "https://digihealth-6uy7.onrender.com/api/admin/personnel";

/* =========================================================
GENERIC REQUEST HELPER
========================================================= */

async function onboardRequest(endpoint, payload, successMessage) {

  try {

    const res = await fetch(`${API_BASE}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {

      alert(
        data.message ||
        data.error ||
        "Unable to complete request"
      );

      return;
    }

    alert(successMessage || "Onboarding successful");

    return data;

  } catch (err) {

    console.error(err);

    alert("Network error. Please try again.");
  }
}

/* =========================================================
ADMIN
========================================================= */

async function submitAdmin() {

  const payload = {
    fullName: document.getElementById("admin_full_name").value.trim(),
    email: document.getElementById("admin_email").value.trim(),
    phoneNumber: document.getElementById("admin_phone").value.trim(),
    department: document.getElementById("admin_department").value.trim(),
    accessLevel: document.getElementById("admin_access_level").value,
    status: document.getElementById("admin_status").value
  };

  const res = await onboardRequest(
    "admins",
    payload,
    "Admin onboarded successfully"
  );

  if (res) closeModal("adminModal");
}

/* =========================================================
RELATIONSHIP MANAGER
========================================================= */

async function submitRM() {

  const payload = {
    fullName: document.getElementById("rm_full_name").value.trim(),
    email: document.getElementById("rm_email").value.trim(),
    phoneNumber: document.getElementById("rm_phone").value.trim(),
    locationArea: document.getElementById("rm_location").value.trim(),
    gender: document.getElementById("rm_gender").value,
    dateOfBirth: document.getElementById("rm_dob").value,
    region: document.getElementById("rm_region").value.trim(),
    yearsOfExperience: document.getElementById("rm_experience").value,
    employmentStatus: document.getElementById("rm_employment_status").value,
    professionalSummary: document.getElementById("rm_summary").value.trim(),
    availabilityType: document.getElementById("rm_availability").value
  };

  const res = await onboardRequest(
    "relationship-managers",
    payload,
    "Relationship Manager onboarded successfully"
  );

  if (res) closeModal("rmModal");
}

/* =========================================================
CLINICAL PERSONNEL
========================================================= */

async function submitClinical() {

  const specialisations = [
    ...document.querySelectorAll(
      "#clinicalModal input[name='clinical_specialisation']:checked"
    )
  ].map(el => el.value);

  const workingHours = [
    ...document.querySelectorAll(
      "#clinicalModal input[name='clinical_hours']:checked"
    )
  ].map(el => el.value);

  const payload = {
    fullName: document.getElementById("clinical_full_name").value.trim(),
    email: document.getElementById("clinical_email").value.trim(),
    phoneNumber: document.getElementById("clinical_phone").value.trim(),
    locationArea: document.getElementById("clinical_location").value.trim(),
    gender: document.getElementById("clinical_gender").value,
    dateOfBirth: document.getElementById("clinical_dob").value,

    serviceProviderType: document.getElementById("clinical_role").value,
    yearsOfExperience: document.getElementById("clinical_experience").value,
    highestQualification: document.getElementById("clinical_qualification").value,
    employmentStatus: document.getElementById("clinical_employment_status").value,

    areasOfSpecialisation: specialisations,
    professionalSummary: document.getElementById("clinical_summary").value.trim(),

    licenseNumber: document.getElementById("clinical_license").value.trim(),

    availabilityType: document.getElementById("clinical_availability").value,
    startDate: document.getElementById("clinical_start_date").value,
    preferredWorkingHours: workingHours,
    coverageAreas: document.getElementById("clinical_coverage").value.trim(),
    additionalInfo: document.getElementById("clinical_additional_info").value.trim()
  };

  const res = await onboardRequest(
    "clinical",
    payload,
    "Clinical personnel onboarded successfully"
  );

  if (res) closeModal("clinicalModal");
}

/* =========================================================
PATIENT
========================================================= */

async function submitPatient() {

  const payload = {
    fullName: document.getElementById("patient_full_name").value.trim(),
    email: document.getElementById("patient_email").value.trim(),
    phoneNumber: document.getElementById("patient_phone").value.trim(),
    bloodGroup: document.getElementById("patient_blood_group").value.trim(),
    insuranceProvider: document.getElementById("patient_insurance").value.trim(),
    nextOfKin: document.getElementById("patient_nok").value.trim()
  };

  const res = await onboardRequest(
    "patients",
    payload,
    "Patient onboarded successfully"
  );

  if (res) closeModal("patientModal");
}

/* =========================================================
CNO / MD
========================================================= */

async function submitCNO() {

  const payload = {
    fullName: document.getElementById("cno_full_name").value.trim(),
    email: document.getElementById("cno_email").value.trim(),
    phoneNumber: document.getElementById("cno_phone").value.trim(),
    hospital: document.getElementById("cno_hospital").value.trim(),
    department: document.getElementById("cno_department").value.trim(),
    medicalLicense: document.getElementById("cno_license").value.trim(),
    yearsOfExperience: document.getElementById("cno_experience").value,
    locationArea: document.getElementById("cno_location").value.trim()
  };

  const res = await onboardRequest(
    "executives",
    payload,
    "CNO / MD onboarded successfully"
  );

  if (res) closeModal("cnoModal");
}

/* =========================================================
LAB SCIENTIST
========================================================= */

async function submitLabScientist() {

  const specialisations = [
    ...document.querySelectorAll(
      "#labScientistModal input[name='lab_specialisation']:checked"
    )
  ].map(el => el.value);

  const payload = {
    fullName: document.getElementById("lab_full_name").value.trim(),
    email: document.getElementById("lab_email").value.trim(),
    phoneNumber: document.getElementById("lab_phone").value.trim(),
    certification: document.getElementById("lab_certification").value.trim(),
    specialTests: document.getElementById("lab_tests").value.trim(),
    yearsOfExperience: document.getElementById("lab_experience").value,
    highestQualification: document.getElementById("lab_qualification").value,
    areasOfSpecialisation: specialisations,
    locationArea: document.getElementById("lab_location").value.trim(),
    availabilityType: document.getElementById("lab_availability").value
  };

  const res = await onboardRequest(
    "lab-scientist",
    payload,
    "Lab Scientist onboarded successfully"
  );

  if (res) closeModal("labScientistModal");
}

/* =========================================================
PHARMACIST
========================================================= */

async function submitPharmacist() {

  const payload = {
    fullName: document.getElementById("pharmacist_full_name").value.trim(),
    email: document.getElementById("pharmacist_email").value.trim(),
    phoneNumber: document.getElementById("pharmacist_phone").value.trim(),
    pcnNumber: document.getElementById("pharmacist_pcn").value.trim(),
    branch: document.getElementById("pharmacist_branch").value.trim(),
    yearsOfExperience: document.getElementById("pharmacist_experience").value,
    highestQualification: document.getElementById("pharmacist_qualification").value,
    locationArea: document.getElementById("pharmacist_location").value.trim(),
    availabilityType: document.getElementById("pharmacist_availability").value
  };

  const res = await onboardRequest(
    "pharmacists",
    payload,
    "Pharmacist onboarded successfully"
  );

  if (res) closeModal("pharmacistModal");
}

/* =========================================================
FINANCE
========================================================= */

async function submitFinance() {

  const payload = {
    fullName: document.getElementById("finance_full_name").value.trim(),
    email: document.getElementById("finance_email").value.trim(),
    phoneNumber: document.getElementById("finance_phone").value.trim(),
    department: document.getElementById("finance_department").value.trim(),
    role: document.getElementById("finance_role").value,
    employeeId: document.getElementById("finance_employee_id").value.trim(),
    status: document.getElementById("finance_status").value
  };

  const res = await onboardRequest(
    "finance",
    payload,
    "Finance staff onboarded successfully"
  );

  if (res) closeModal("financeModal");
}

/* =========================================================
CUSTOMER CARE
========================================================= */

async function submitCustomerCare() {

  const payload = {
    fullName: document.getElementById("cc_full_name").value.trim(),
    email: document.getElementById("cc_email").value.trim(),
    phoneNumber: document.getElementById("cc_phone").value.trim(),
    shift: document.getElementById("cc_shift").value,
    supportLevel: document.getElementById("cc_support_level").value,
    language: document.getElementById("cc_language").value.trim(),
    status: document.getElementById("cc_status").value
  };

  const res = await onboardRequest(
    "customer-care",
    payload,
    "Customer care staff onboarded successfully"
  );

  if (res) closeModal("customerCareModal");
}



   /* =========================
    INIT
  ========================= */

  document.addEventListener("DOMContentLoaded", () => {
    loadPersonnel();
  });

