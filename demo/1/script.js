'use strict';

// Independent, local-only website demo. No analytics, network submissions, or storage.
const menuButton = document.querySelector('.menu-trigger');
const menu = document.querySelector('#site-menu');
const wideScreen = window.matchMedia('(min-width: 1050px)');
function collapseMenu() {
  menu.hidden = !wideScreen.matches;
  menuButton.setAttribute('aria-expanded', 'false');
}
collapseMenu();
wideScreen.addEventListener('change', collapseMenu);
menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded));
  menu.hidden = expanded;
});
menu.addEventListener('click', event => {
  const link = event.target.closest('a');
  if (link) {
    collapseMenu();
    const target = document.querySelector(link.getAttribute('href'));
    target?.setAttribute('tabindex', '-1');
    target?.focus({ preventScroll: true });
  }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    collapseMenu();
    menuButton.focus();
  }
});

const photographs = [
  { src: './media/space.jpg', alt: 'Inside a gym with exercise equipment and open space for training', caption: 'Room to put in the work.' },
  { src: './media/club.jpg', alt: 'An athlete preparing a deadlift on the strength floor', caption: 'A little stronger, every time.' },
  { src: './media/coach.jpg', alt: 'A woman working on core strength on an exercise mat', caption: 'Progress at your own pace.' }
];
let photoIndex = 0;
function changePhoto(direction) {
  photoIndex = (photoIndex + direction + photographs.length) % photographs.length;
  const photo = photographs[photoIndex];
  const picture = document.querySelector('#gallery-image');
  picture.src = photo.src;
  picture.alt = photo.alt;
  document.querySelector('#gallery-caption').textContent = photo.caption;
  document.querySelector('#gallery-count').textContent = `0${photoIndex + 1} / 03`;
}
document.querySelector('#gallery-prev').addEventListener('click', () => changePhoto(-1));
document.querySelector('#gallery-next').addEventListener('click', () => changePhoto(1));

const dialog = document.querySelector('#visit-dialog');
const form = document.querySelector('#request-form');
const result = document.querySelector('#request-result');
const nameField = form.elements.visitorName;
const phoneField = form.elements.visitorPhone;
let opener;
document.querySelectorAll('[data-visit]').forEach(button => button.addEventListener('click', () => {
  opener = button.closest('#site-menu') && !wideScreen.matches ? menuButton : button;
  collapseMenu();
  dialog.showModal();
  document.body.classList.add('dialog-open');
  nameField.focus();
}));
document.querySelectorAll('.dialog-close, [data-close]').forEach(button => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  form.reset();
  form.hidden = false;
  result.hidden = true;
  nameField.setCustomValidity('');
  phoneField.setCustomValidity('');
  opener?.focus({ preventScroll: true });
});
[nameField, phoneField].forEach(field => field.addEventListener('input', () => field.setCustomValidity('')));
form.addEventListener('submit', event => {
  event.preventDefault();
  nameField.setCustomValidity(nameField.value.trim().length >= 2 ? '' : 'Please enter your name using at least two characters.');
  const phone = phoneField.value.trim();
  const digits = phone.replace(/\D/g, '');
  phoneField.setCustomValidity(/^\+?[\d\s().-]+$/.test(phone) && digits.length >= 10 && digits.length <= 15 ? '' : 'Please enter a phone number with 10–15 digits.');
  if (!form.reportValidity()) return;
  form.reset();
  form.hidden = true;
  result.hidden = false;
  result.focus();
});
