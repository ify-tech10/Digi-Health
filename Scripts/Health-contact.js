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

  function handleSubmit() {
  const name = document.getElementById('fullname').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const service = document.getElementById('service').value;

  if (!name || !phone || !service || !email) {
    alert('Please fill in your name, phone number, and the service needed.');
    return;
  }

  const templateParams = {
    from_name:   name,
    email:       email,
    phone:       phone,
    location:    document.getElementById('location').value.trim(),
    service:     service,
    description: document.getElementById('description').value.trim(),
    contact_time: document.getElementById('contact-time').value,
  };

  // Show loading state
  const btn = document.querySelector('.btn-submit');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  emailjs.send('service_bd7u8qo', 'template_6yhegps', templateParams)
    .then(() => {
      alert('Thank you! We\'ll be in touch within 1 hour during operating hours.');
      // Clear form
      document.getElementById('fullname').value = '';
      document.getElementById('phone').value = '';
      document.getElementById('location').value = '';
      document.getElementById('service').selectedIndex = 0;
      document.getElementById('description').value = '';
      document.getElementById('contact-time').selectedIndex = 0;
    })
    .catch((error) => {
      alert('Something went wrong. Please call or WhatsApp us directly.');
      console.error('EmailJS error:', error);
    })
    .finally(() => {
      btn.textContent = 'Submit Request';
      btn.disabled = false;
    });
}