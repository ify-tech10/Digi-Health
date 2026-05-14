emailjs.init('YOUR_PUBLIC_KEY'); // 🔁 Replace with your public key

// ── Mobile menu ──
function toggleMenu() {
  document.getElementById('mobileNav').classList.toggle('open');
}

document.querySelectorAll('.mobile-nav a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('mobileNav').classList.remove('open');
  });
});

// ── File name display ──
function showFileName(input, targetId) {
  const target = document.getElementById(targetId);
  target.textContent = input.files[0] ? input.files[0].name : '';
}

// ── Get checked checkboxes ──
function getChecked(prefix) {
  return Array.from(
    document.querySelectorAll(`input[type="checkbox"][name^="${prefix}"]:checked`)
  ).map(cb => cb.value).join(', ') || 'None selected';
}

// ── UI helpers ──
function clearErrors() {
  document.querySelectorAll('.error-text').forEach(el => el.remove());
  document.querySelectorAll('input, select, textarea').forEach(el => {
    el.classList.remove('input-error');
  });
}

function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) return;

  field.classList.add('input-error');

  const error = document.createElement('div');
  error.className = 'error-text';
  error.style.color = 'red';
  error.style.fontSize = '12px';
  error.style.marginTop = '4px';
  error.textContent = message;

  field.parentNode.appendChild(error);
}

// ── Submit handler ──
async function handleApply() {
  clearErrors();

  const formData = new FormData();

  // Basic fields
  const fullName = document.getElementById('full_name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const serviceProviderType = document.getElementById('caregiver_type').value;

  formData.append("fullName", fullName);
  formData.append("Email", email);
  formData.append("phoneNumber", phone);
  formData.append("serviceProviderType", serviceProviderType);

  // Other fields
  formData.append("applicant_location", document.getElementById('location').value.trim());
  formData.append("applicant_gender", document.getElementById('gender').value);
  formData.append("YearsOfExperience", document.getElementById('experience').value);
  formData.append("qualification", document.getElementById('qualification').value);
  formData.append("employment_status", document.getElementById('employment_status').value);
  formData.append("specialisations", getChecked('spec_'));
  formData.append("professional_summary", document.getElementById('professional_summary').value);

  const cvFile = document.getElementById('cv_file').files[0];
  if (cvFile) formData.append("cv", cvFile);

  formData.append("ref1FullName", document.getElementById('ref1_name').value || 'Not provided');
  formData.append("ref1Relationship", document.getElementById('ref1_relationship').value || 'Not provided');
  formData.append("ref1Phone", document.getElementById('ref1_phone').value || 'Not provided');
  formData.append("ref1Email", document.getElementById('ref1_email').value || 'Not provided');

  formData.append("ref2FullName", document.getElementById('ref2_name').value || 'Not provided');
  formData.append("ref2Relationship", document.getElementById('ref2_relationship').value || 'Not provided');
  formData.append("ref2Phone", document.getElementById('ref2_phone').value || 'Not provided');
  formData.append("ref2Email", document.getElementById('ref2_email').value || 'Not provided');

  formData.append("availabilityType", document.getElementById('availability_type').value);
  formData.append("preferredHours", getChecked('hours_'));
  formData.append("locationArea", document.getElementById('coverage_areas').value || 'Not specified');
  formData.append("start_date", document.getElementById('start_date').value || 'Not specified');
  formData.append("additional_info", document.getElementById('additional_info').value || 'None');

  const btn = document.getElementById('submitBtn');
  btn.textContent = "Submitting...";
  btn.disabled = true;

  console.log("availabilityType:", document.getElementById('availability_type').value);

  try {
    const response = await fetch(
      "https://digihealth-6uy7.onrender.com/api/auth/provider/apply",
      {
        method: "POST",
        body: formData
      }
    );

    const data = await response.json();

    // ❌ HANDLE BACKEND VALIDATION ERRORS
    if (!response.ok) {
  console.log(data);

  if (data.validationErrors) {
        Object.entries(data.validationErrors).forEach(([field, message]) => {
          alert(`${message}`);

          const inputMap = {
            email: "email",
            phoneNumber: "phone"
          };

          const fieldId = inputMap[field];

          if (fieldId) {
            const el = document.getElementById(fieldId);
            if (el) {
              el.classList.add("input-error");

              const err = document.createElement("div");
              err.className = "error-text";
              err.style.color = "red";
              err.textContent = message;

              el.parentNode.appendChild(err);
            }
          }
        });

      } else {
        alert(data.message || "Validation failed");
      }

      return;
    }

    alert("Application submitted successfully!");

    // Optional: reset form fields
    document.querySelectorAll("input, textarea, select").forEach(el => {
      if (el.type !== "checkbox" && el.type !== "file") {
        el.value = "";
      }
      if (el.type === "checkbox") el.checked = false;
    });

  } catch (err) {
    console.error(err);
    alert("Network error");
  } finally {
    btn.textContent = "Submit Application";
    btn.disabled = false;
  }
}