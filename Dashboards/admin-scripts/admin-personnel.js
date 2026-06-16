
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
      "https://digihealth-2795.onrender.com/api/admin/providers?status=APPROVED",
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

const API_BASE = "https://digihealth-2795.onrender.com/api/admin/personnel";

/* =========================================================
GENERIC REQUEST HELPER
========================================================= */

async function onboardRequest(endpoint, inputData, successMessage, modalId) {

  const user = JSON.parse(localStorage.getItem("dh_user") || "{}");

  let body;
  let headers = {
    Authorization: `Bearer ${user.token}`
  };

  // =========================
  // FORMDATA MODE
  // =========================
  if (inputData instanceof FormData) {

    body = inputData;

  } else {

    // =========================
    // JSON MODE
    // =========================
    headers["Content-Type"] = "application/json";

    body = JSON.stringify(inputData);
  }

  // =========================
  // BUTTON STATE
  // =========================
  const btn = document.querySelector(`#${modalId} .btn-modal-primary`);
  const originalText = btn?.innerHTML;

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = "Submitting...";
  }

  try {

    const res = await fetch(`${API_BASE}/${endpoint}`, {
      method: "POST",
      headers,
      body
    });

    const responseData = await res.json().catch(() => ({}));

    if (!res.ok) {
      alert(responseData.message || responseData.error || "Unable to complete request");
      return null;
    }

    alert(successMessage || "Onboarding successful");

    return responseData;

  } catch (err) {

    console.error(err);
    alert("Network error. Please try again.");
    return null;

  } finally {

    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  }
}

/* =========================================================
ADMIN
========================================================= */

async function submitAdmin() {

  const payload = {

    // =========================
    // PERSONAL DETAILS
    // =========================
    firstName: document.getElementById("admin_first_name").value.trim(),

    lastName: document.getElementById("admin_last_name").value.trim(),

    email: document.getElementById("admin_email").value.trim(),

    phoneNumber: document.getElementById("admin_phone").value.trim(),

    password: document.getElementById("admin_password").value,

    // =========================
    // STATUS
    // =========================
    status: document.getElementById("admin_status").value
  };

  // =========================
  // API CALL
  // =========================
  const res = await onboardRequest(
    "admins",
    payload,
    "Admin onboarded successfully",
    "adminModal"
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
    "Relationship Manager onboarded successfully",
    "rmModal"
  );

  if (res) closeModal("rmModal");
}

/* =========================================================
CLINICAL PERSONNEL
========================================================= */

async function submitClinical() {

  const formData = new FormData();

  // =========================
  // PERSONAL DETAILS
  // =========================
  formData.append("fullName", document.getElementById("clinical_full_name").value.trim());
  formData.append("email", document.getElementById("clinical_email").value.trim());
  formData.append("phoneNumber", document.getElementById("clinical_phone").value.trim());
  formData.append("location", document.getElementById("clinical_location").value.trim());
  formData.append("gender", document.getElementById("clinical_gender").value);
  formData.append("dateOfBirth", document.getElementById("clinical_dob").value);

  // =========================
  // PROFESSIONAL DETAILS
  // =========================
  formData.append("role", document.getElementById("clinical_role").value);
  formData.append("yearsOfExperience", document.getElementById("clinical_experience").value);
  formData.append("highestQualification", document.getElementById("clinical_qualification").value);
  formData.append("employmentStatus", document.getElementById("clinical_employment_status").value);
  formData.append("licenseNumber", document.getElementById("clinical_license").value.trim());

  // =========================
  // SPECIALISATION (CHECKBOXES)
  // =========================
  const specialisations = Array.from(
    document.querySelectorAll("#clinicalModal .checkbox-group input[type='checkbox']:checked")
  ).map(cb => cb.value);

  formData.append("specialisations", JSON.stringify(specialisations));

  // =========================
  // PROFESSIONAL SUMMARY
  // =========================
  formData.append("summary", document.getElementById("clinical_summary").value.trim());

  // =========================
  // DOCUMENTS (FILES)
  // =========================
  const cv = document.getElementById("clinical_cv").files[0];
  if (cv) formData.append("cv", cv);

  const certificate = document.getElementById("clinical_cert").files[0];
  if (certificate) formData.append("certificateFile", certificate);

  const idFile = document.getElementById("clinical_id").files[0];
  if (idFile) formData.append("governmentId", idFile);

  const licenseFile = document.getElementById("clinical_license_file").files[0];
  if (licenseFile) formData.append("licenseFile", licenseFile);

  // =========================
  // REFERENCES
  // =========================
  formData.append("reference1Name", document.getElementById("clinical_ref1_name").value.trim());
  formData.append("reference1Relationship", document.getElementById("clinical_ref1_relationship").value.trim());
  formData.append("reference1Phone", document.getElementById("clinical_ref1_phone").value.trim());
  formData.append("reference1Email", document.getElementById("clinical_ref1_email").value.trim());

  // =========================
  // AVAILABILITY
  // =========================
  formData.append("availabilityType", document.getElementById("clinical_availability").value);
  formData.append("startDate", document.getElementById("clinical_start_date").value);
  formData.append("coverageAreas", document.getElementById("clinical_coverage").value);

  // WORK HOURS (checkboxes)
  const workHours = Array.from(
    document.querySelectorAll("#clinicalModal input[type='checkbox']:checked")
  ).map(cb => cb.value);

  formData.append("workHours", JSON.stringify(workHours));

  // =========================
  // ADDITIONAL INFO
  // =========================
  formData.append("additionalInfo", document.getElementById("clinical_additional_info").value.trim());

  // =========================
  // API CALL
  // =========================
  const res = await onboardRequest(
    "clinical-personnel",
    formData,
    "Clinical personnel onboarded successfully",
    "clinicalModal"
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
    // bloodGroup: document.getElementById("patient_blood_group").value.trim(),
    // insuranceProvider: document.getElementById("patient_insurance").value.trim(),
    // nextOfKin: document.getElementById("patient_nok").value.trim()
  };

  const res = await onboardRequest(
    "patients",
    payload,
    "Patient onboarded successfully",
    "patientModal"
  );

  if (res) closeModal("patientModal");
}

/* =========================================================
CNO / MD
========================================================= */

async function submitCNO() {

  const formData = new FormData();

  // =========================
  // PERSONAL DETAILS
  // =========================
  formData.append("fullName", document.getElementById("cno_full_name").value.trim());
  formData.append("email", document.getElementById("cno_email").value.trim());
  formData.append("phoneNumber", document.getElementById("cno_phone").value.trim());
  formData.append("gender", document.getElementById("cno_gender").value);
  formData.append("dateOfBirth", document.getElementById("cno_dob").value);
  formData.append("location", document.getElementById("cno_location").value.trim());

  // =========================
  // EXECUTIVE DETAILS
  // =========================
  formData.append("executiveRole", document.getElementById("cno_role").value);
  formData.append("hospital", document.getElementById("cno_hospital").value.trim());
  formData.append("licenseNumber", document.getElementById("cno_license").value.trim());
  formData.append("yearsOfExperience", document.getElementById("cno_experience").value);
  formData.append("highestQualification", document.getElementById("cno_qualification").value);
  formData.append("department", document.getElementById("cno_department").value.trim());

  // =========================
  // SPECIALISATION (CHECKBOXES)
  // =========================
  const specialisations = Array.from(
    document.querySelectorAll("#cnoModal .checkbox-group input[type='checkbox']:checked")
  ).map(cb => cb.value);

  formData.append("specialisations", JSON.stringify(specialisations));

  // =========================
  // SUMMARY
  // =========================
  formData.append("summary", document.getElementById("cno_summary").value.trim());

  // =========================
  // DOCUMENTS (FILES)
  // =========================
  const cv = document.getElementById("cno_cv").files[0];
  if (cv) formData.append("cv", cv);

  const licenseFile = document.getElementById("cno_license_file").files[0];
  if (licenseFile) formData.append("medicalLicenseFile", licenseFile);

  const certificate = document.getElementById("cno_certificate").files[0];
  if (certificate) formData.append("certificateFile", certificate);

  const idFile = document.getElementById("cno_id").files[0];
  if (idFile) formData.append("governmentId", idFile);

  // =========================
  // REFERENCE
  // =========================
  formData.append("referenceName", document.getElementById("cno_ref_name").value.trim());
  formData.append("referenceRelationship", document.getElementById("cno_ref_relationship").value.trim());
  formData.append("referencePhone", document.getElementById("cno_ref_phone").value.trim());
  formData.append("referenceEmail", document.getElementById("cno_ref_email").value.trim());

  // =========================
  // ADDITIONAL INFO
  // =========================
  formData.append("additionalInfo", document.getElementById("cno_additional_info").value.trim());

  // =========================
  // API CALL
  // =========================
  const res = await onboardRequest(
    "cno",
    formData,
    "Executive onboarded successfully",
    "cnoModal"
  );

  if (res) closeModal("cnoModal");
}

/* =========================================================
LAB SCIENTIST
========================================================= */

async function submitLabScientist() {

  const formData = new FormData();

  // =====================
  // PERSONAL DETAILS
  // =====================
  formData.append("fullName", document.getElementById("lab_full_name").value.trim());
  formData.append("email", document.getElementById("lab_email").value.trim());
  formData.append("phoneNumber", document.getElementById("lab_phone").value.trim());
  formData.append("location", document.getElementById("lab_location").value.trim());
  formData.append("dateOfBirth", document.getElementById("lab_dob").value);

  // =====================
  // PROFESSIONAL DETAILS
  // =====================
  formData.append("role", document.getElementById("lab_role").value);
  formData.append("yearsOfExperience", document.getElementById("lab_experience").value);
  formData.append("highestQualification", document.getElementById("lab_qualification").value);
  formData.append("licenseNumber", document.getElementById("lab_license").value.trim());
  formData.append("specialisation", document.getElementById("lab_specialisation").value.trim());

  // =====================
  // CHECKBOX SKILLS
  // =====================
  const selectedTests = Array.from(
    document.querySelectorAll(".checkbox-group input[type='checkbox']:checked")
  ).map(cb => cb.value);

  formData.append("specialTests", JSON.stringify(selectedTests));

  // =====================
  // DOCUMENTS (FILES)
  // =====================
  const cv = document.getElementById("lab_cv").files[0];
  if (cv) formData.append("cv", cv);

  const certification = document.getElementById("lab_certification_file").files[0];
  if (certification) formData.append("certification", certification);

  const idFile = document.getElementById("lab_id").files[0];
  if (idFile) formData.append("governmentId", idFile);

  const licenseFile = document.getElementById("lab_license_file").files[0];
  if (licenseFile) formData.append("licenseFile", licenseFile);

  // =====================
  // REFERENCES
  // =====================
  formData.append("referenceName", document.getElementById("lab_ref_name").value.trim());
  formData.append("referenceRelationship", document.getElementById("lab_ref_relationship").value.trim());
  formData.append("referencePhone", document.getElementById("lab_ref_phone").value.trim());
  formData.append("referenceEmail", document.getElementById("lab_ref_email").value.trim());

  // =====================
  // AVAILABILITY
  // =====================
  formData.append("availabilityType", document.getElementById("lab_availability").value);
  formData.append("startDate", document.getElementById("lab_start_date").value);
  formData.append("coverageAreas", document.getElementById("lab_coverage").value.trim());
  formData.append("additionalInfo", document.getElementById("lab_additional_info").value.trim());

  // =====================
  // API CALL
  // =====================
  const res = await onboardRequest(
    "lab-scientists",
    formData,
    "Laboratory Scientist onboarded successfully",
    "labScientistModal"
  );

  if (res) closeModal("labScientistModal");
}

/* =========================================================
PHARMACIST
========================================================= */

async function submitPharmacist() {

  const formData = new FormData();

  // =========================
  // PERSONAL DETAILS
  // =========================
  formData.append("fullName", document.getElementById("pharmacist_full_name").value.trim());
  formData.append("email", document.getElementById("pharmacist_email").value.trim());
  formData.append("phoneNumber", document.getElementById("pharmacist_phone").value.trim());
  formData.append("branch", document.getElementById("pharmacist_branch").value.trim());

  // =========================
  // PROFESSIONAL DETAILS
  // =========================
  formData.append("licenseNumber", document.getElementById("pharmacist_license").value.trim());
  formData.append("yearsOfExperience", document.getElementById("pharmacist_experience").value);
  formData.append("specialization", document.getElementById("pharmacist_specialization").value.trim());

  // OPTIONAL
  formData.append("pcnNumber", document.getElementById("pharmacist_pcn").value.trim());

  // =========================
  // CV FILE
  // =========================
  const cv = document.getElementById("pharmacist_cv").files[0];
  if (cv) {
    formData.append("cv", cv);
  }

  // =========================
  // API CALL
  // =========================
  const res = await onboardRequest(
    "pharmacists",
    formData,
    "Pharmacist onboarded successfully",
    "pharmacistModal"
  );

  if (res) closeModal("pharmacistModal");
}

/* =========================================================
FINANCE
========================================================= */

async function submitFinance() {

  const formData = new FormData();

  // =========================
  // PERSONAL DETAILS
  // =========================
  formData.append("fullName", document.getElementById("finance_full_name").value.trim());
  formData.append("email", document.getElementById("finance_email").value.trim());
  formData.append("phoneNumber", document.getElementById("finance_phone").value.trim());

  // =========================
  // PROFESSIONAL DETAILS
  // =========================
  formData.append("department", document.getElementById("finance_department").value.trim());
  formData.append("roleLevel", document.getElementById("finance_role_level").value);
  formData.append("accessLevel", document.getElementById("finance_access").value);
  formData.append("status", document.getElementById("finance_status").value);

  // =========================
  // CV FILE
  // =========================
  const cv = document.getElementById("finance_cv").files[0];
  if (cv) {
    formData.append("cv", cv);
  }

  // =========================
  // API CALL
  // =========================
  const res = await onboardRequest(
    "finance-managers",
    formData,
    "Finance Manager onboarded successfully",
    "financeModal"
  );

  if (res) closeModal("financeModal");
}

/* =========================================================
CUSTOMER CARE
========================================================= */

async function submitCustomerCare() {

  const formData = new FormData();

  // =========================
  // PERSONAL DETAILS
  // =========================
  formData.append("fullName", document.getElementById("cc_full_name").value.trim());
  formData.append("email", document.getElementById("cc_email").value.trim());
  formData.append("phoneNumber", document.getElementById("cc_phone").value.trim());

  // =========================
  // ROLE DETAILS
  // =========================
  formData.append("shift", document.getElementById("cc_shift").value);
  formData.append("supportChannel", document.getElementById("cc_channel").value);
  formData.append("yearsOfExperience", document.getElementById("cc_experience").value);
  formData.append("status", document.getElementById("cc_status").value);

  // =========================
  // CV FILE
  // =========================
  const cv = document.getElementById("cc_cv").files[0];
  if (cv) {
    formData.append("cv", cv);
  }

  // =========================
  // API CALL
  // =========================
  const res = await onboardRequest(
    "customer-care",
    formData,
    "Customer Care Specialist onboarded successfully",
    "customerCareModal"
  );

  if (res) closeModal("customerCareModal");
}



   /* =========================
    INIT
  ========================= */

  document.addEventListener("DOMContentLoaded", () => {
    loadPersonnel();
  });

