emailjs.init('L1aziile6j91l0MqB'); // paste your public key here
  function toggleMenu() {
    document.getElementById('mobileNav').classList.toggle('open');
  }
  document.querySelectorAll('.mobile-nav a').forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('mobileNav').classList.remove('open');
    });
  });

  document.querySelector('.form-submit-row').addEventListener('click',handleSubmit);

  async function handleSubmit() {
  const name = document.getElementById('fullname').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const service = document.getElementById('service').value;


  const payload = {
  fullName: name,
  email: email,
  phoneNumber: phone,
  address: document.getElementById('location').value.trim(),
  locationArea: document.getElementById('serviceArea').value,
  serviceNeeded: service,
  description: document.getElementById('description').value.trim(),
  preferredContactTime: document.getElementById('contact-time').value
};

  const btn = document.querySelector('.btn-submit');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  try {
    const response = await fetch("https://digihealth-2795.onrender.com/api/care-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

      // ❌ HANDLE BACKEND VALIDATION ERRORS
      
    if (!response.ok) {
      if (data.errors && typeof data.errors === "object") {
        // field-level errors
        Object.entries(data.errors).forEach(([field, message]) => {
          const map = {
            fullName: "fullname",
            email: "email",
            phoneNumber: "phone",
            serviceNeeded: "service",
            locationArea: "serviceArea",
            description: "description",
            preferredContactTime: "contact-time"
          };

          const fieldId = map[field];
          if (fieldId) showFieldError(fieldId, message);
        });

      } else {
        alert(data.message || "Submission failed");
      }

      return;
    }

    alert("Request submitted successfully! We will contact you soon.");

    // reset form
    document.getElementById('fullname').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('email').value = '';
    document.getElementById('location').value = '';
    document.getElementById('service').selectedIndex = 0;
    document.getElementById('description').value = '';
    document.getElementById('contact-time').selectedIndex = 0;

  } catch (err) {
    console.error(err);
    alert("Network error. Please try again later.");
  } finally {
    btn.textContent = 'Submit Request';
    btn.disabled = false;
  }
}