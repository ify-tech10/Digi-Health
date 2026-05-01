// ── Init EmailJS ──
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
    return Array.from(document.querySelectorAll(`input[type="checkbox"][name^="${prefix}"]:checked`))
      .map(cb => cb.value).join(', ') || 'None selected';
  }

  // ── Submit handler ──
 async function handleApply() {
  const formData = new FormData();

  // Basic fields
  formData.append("fullName", document.getElementById('full_name').value);
  formData.append("Email", document.getElementById('email').value);
  formData.append("phoneNumber", document.getElementById('phone').value);
  formData.append("serviceProviderType", document.getElementById('caregiver_type').value);

  // Other fields
  formData.append("applicant_location", document.getElementById('location').value);
  formData.append("applicant_gender", document.getElementById('gender').value);
  formData.append("YearsOfExperience", document.getElementById('experience').value);
  formData.append("qualification", document.getElementById('qualification').value);
  formData.append("employment_status", document.getElementById('employment_status').value);
  formData.append("specialisations", getChecked('spec_'));
  formData.append("professional_summary", document.getElementById('professional_summary').value);
  formData.append("cv", document.getElementById('cv_file').files[0]);

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

  // Example file input (if you have one)
  const fileInput = document.getElementById("cv");
  if (fileInput && fileInput.files.length > 0) {
    formData.append("cv", fileInput.files[0]);
  }

  const btn = document.getElementById('submitBtn');
  btn.textContent = "Submitting...";
  btn.disabled = true;

  try {
    const response = await fetch("https://digihealth-6uy7.onrender.com/api/auth/provider/apply", {
      method: "POST",
      body: formData // ✅ NO headers
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Submission failed");
      return;
    }

    alert("Application submitted successfully!");

  } catch (err) {
    alert("Network error");
    console.error(err);
  } finally {
    btn.textContent = "Submit Application";
    btn.disabled = false;
  }
}