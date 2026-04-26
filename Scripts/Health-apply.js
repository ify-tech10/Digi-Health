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
  function getChecked(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
      .map(cb => cb.value).join(', ') || 'None selected';
  }

  // ── Submit handler ──
  function handleApply() {
    const name      = document.getElementById('full_name').value.trim();
    const email     = document.getElementById('email').value.trim();
    const phone     = document.getElementById('phone').value.trim();
    const careType  = document.getElementById('caregiver_type').value;
    const avail     = document.getElementById('availability_type').value;

    if (!name || !email || !phone || !careType || !avail) {
      alert('Please fill in all required fields marked with *');
      return;
    }

    const btn = document.getElementById('submitBtn');
    btn.textContent = 'Submitting...';
    btn.disabled = true;

    // ── Params for admin notification email ──
    const adminParams = {
      applicant_name:        name,
      applicant_email:       email,
      applicant_phone:       phone,
      applicant_location:    document.getElementById('location').value.trim(),
      applicant_gender:      document.getElementById('gender').value || 'Not specified',
      caregiver_type:        careType,
      experience:            document.getElementById('experience').value || 'Not specified',
      qualification:         document.getElementById('qualification').value || 'Not specified',
      employment_status:     document.getElementById('employment_status').value || 'Not specified',
      specialisations:       getChecked('specialisation'),
      professional_summary:  document.getElementById('professional_summary').value.trim() || 'Not provided',
      ref1_name:             document.getElementById('ref1_name').value.trim() || 'Not provided',
      ref1_relationship:     document.getElementById('ref1_relationship').value.trim() || 'Not provided',
      ref1_phone:            document.getElementById('ref1_phone').value.trim() || 'Not provided',
      ref1_email:            document.getElementById('ref1_email').value.trim() || 'Not provided',
      ref2_name:             document.getElementById('ref2_name').value.trim() || 'Not provided',
      ref2_relationship:     document.getElementById('ref2_relationship').value.trim() || 'Not provided',
      ref2_phone:            document.getElementById('ref2_phone').value.trim() || 'Not provided',
      ref2_email:            document.getElementById('ref2_email').value.trim() || 'Not provided',
      availability_type:     avail,
      preferred_hours:       getChecked('hours'),
      coverage_areas:        document.getElementById('coverage_areas').value.trim() || 'Not specified',
      start_date:            document.getElementById('start_date').value || 'Not specified',
      additional_info:       document.getElementById('additional_info').value.trim() || 'None',
    };

    // ── Params for applicant confirmation email ──
    const confirmParams = {
      applicant_name:  name,
      applicant_email: email,
      caregiver_type:  careType,
    };

    // Send both emails
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_ADMIN_TEMPLATE_ID', adminParams)  // 🔁 Replace IDs
      .then(() => {
        return emailjs.send('YOUR_SERVICE_ID', 'YOUR_CONFIRM_TEMPLATE_ID', confirmParams); // 🔁 Replace IDs
      })
      .then(() => {
        document.getElementById('successBanner').classList.add('show');
        document.getElementById('apply-form').scrollIntoView({ behavior: 'smooth' });
        // Reset form
        document.querySelectorAll('#apply-form input:not([type="checkbox"]):not([type="file"]), #apply-form select, #apply-form textarea').forEach(el => {
          if (el.tagName === 'SELECT') el.selectedIndex = 0;
          else el.value = '';
        });
        document.querySelectorAll('#apply-form input[type="checkbox"]').forEach(cb => cb.checked = false);
        document.querySelectorAll('.file-name').forEach(el => el.textContent = '');
      })
      .catch((err) => {
        alert('Something went wrong. Please WhatsApp us directly.');
        console.error('EmailJS error:', err);
      })
      .finally(() => {
        btn.innerHTML = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Submit Application';
        btn.disabled = false;
      });
  }