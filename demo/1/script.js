'use strict';
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const desktop = window.matchMedia('(min-width: 1001px)');
function closeMenu() {
  navigation.hidden = !desktop.matches;
  menuToggle.setAttribute('aria-expanded', 'false');
}
closeMenu();
desktop.addEventListener('change', closeMenu);
menuToggle.addEventListener('click', () => {
  const opening = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(opening));
  navigation.hidden = !opening;
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuToggle.focus();
  }
});

// Demo only: never transmit or persist personal information.
const form = document.querySelector('#visit-form');
const nameInput = form.elements.name;
const phoneInput = form.elements.phone;
const status = document.querySelector('#form-status');
for (const input of [nameInput, phoneInput]) {
  input.addEventListener('input', () => {
    input.setCustomValidity('');
    status.hidden = true;
  });
}
form.addEventListener('submit', event => {
  event.preventDefault();
  nameInput.setCustomValidity(nameInput.value.trim().length >= 2 ? '' : 'Please enter at least two characters for your name.');
  const phone = phoneInput.value.trim();
  const digits = phone.replace(/\D/g, '');
  phoneInput.setCustomValidity(/^\+?[\d\s().-]+$/.test(phone) && digits.length >= 10 && digits.length <= 15 ? '' : 'Please enter a valid mobile number with 10–15 digits.');
  if (!form.reportValidity()) return;
  form.reset();
  status.textContent = 'You’ve tried the first-session request. On a live gym website, the team would contact you to arrange a visit. This is a demo: nothing was sent and no booking was made.';
  status.hidden = false;
  status.focus();
});

// Enable the demo only after its local submit handler is installed.
form.querySelector('button[type="submit"]').disabled = false;
