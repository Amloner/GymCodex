'use strict';

// OFFBEAT is a standalone concept. Form data never leaves this page.
const root = document.documentElement;
const motionButton = document.querySelector('#motion-toggle');
const systemMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let manuallyPaused = false;
function motionPaused() { return systemMotion.matches || manuallyPaused; }
function syncMotion() {
  const paused = motionPaused();
  root.classList.toggle('motion-off', paused);
  motionButton.setAttribute('aria-pressed', String(paused));
  motionButton.disabled = systemMotion.matches;
  motionButton.setAttribute('aria-label', systemMotion.matches ? 'Animations disabled by your reduced-motion preference' : paused ? 'Resume animations' : 'Pause animations');
  motionButton.querySelector('.motion-label').textContent = systemMotion.matches ? 'Reduced motion' : paused ? 'Motion off' : 'Motion on';
  motionButton.firstElementChild.textContent = paused ? '▷' : 'Ⅱ';
  document.querySelector('.collage').style.removeProperty('--tilt');
}
syncMotion();
motionButton.addEventListener('click', () => { manuallyPaused = !manuallyPaused; syncMotion(); });
systemMotion.addEventListener('change', syncMotion);

const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }), { threshold: 0.12 });
  reveals.forEach(element => observer.observe(element));
}
let scrollQueued = false;
const progress = document.querySelector('.reading-progress');
function updateProgress() {
  const distance = root.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${distance > 0 ? Math.min(1, window.scrollY / distance) : 0})`;
  scrollQueued = false;
}
window.addEventListener('scroll', () => {
  if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateProgress); }
}, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();
const collage = document.querySelector('.collage');
const precisePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
collage.addEventListener('pointermove', event => {
  if (motionPaused() || !precisePointer.matches) return;
  const bounds = collage.getBoundingClientRect();
  collage.style.setProperty('--tilt', `${((event.clientX - bounds.left) / bounds.width - 0.5) * 12}deg`);
});
collage.addEventListener('pointerleave', () => collage.style.setProperty('--tilt', '0deg'));

const rail = document.querySelector('#workout-rail');
function browseWorkouts(direction) {
  const cardWidth = rail.firstElementChild.getBoundingClientRect().width;
  const gap = parseFloat(getComputedStyle(rail).gap) || 0;
  rail.scrollBy({ left: (cardWidth + gap) * direction, behavior: motionPaused() ? 'instant' : 'smooth' });
}
document.querySelector('#workout-prev').addEventListener('click', () => browseWorkouts(-1));
document.querySelector('#workout-next').addEventListener('click', () => browseWorkouts(1));
rail.addEventListener('keydown', event => {
  if (event.target !== rail) return;
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault(); browseWorkouts(event.key === 'ArrowRight' ? 1 : -1);
  }
});

const week = {
  mon: [['06:30', 'AM', 'Heavy things', 'STRENGTH / 50 MIN'], ['07:30', 'AM', 'Good moves', 'MOVEMENT / 45 MIN'], ['06:00', 'PM', 'Full send', 'CONDITIONING / 45 MIN']],
  wed: [['07:00', 'AM', 'Full send', 'CONDITIONING / 45 MIN'], ['12:30', 'PM', 'Heavy things', 'STRENGTH / 50 MIN'], ['07:00', 'PM', 'Good moves', 'MOVEMENT / 45 MIN']],
  fri: [['06:30', 'AM', 'Heavy things', 'STRENGTH / 50 MIN'], ['06:00', 'PM', 'Good moves', 'MOVEMENT / 45 MIN'], ['07:00', 'PM', 'Full send', 'CONDITIONING / 45 MIN']],
  sat: [['08:00', 'AM', 'Good moves', 'MOVEMENT / 45 MIN'], ['09:00', 'AM', 'Full send', 'CONDITIONING / 45 MIN'], ['10:00', 'AM', 'Heavy things', 'STRENGTH / 50 MIN']]
};
const dayButtons = Array.from(document.querySelectorAll('[data-day]'));
const rows = document.querySelector('#class-rows');
function selectDay(button) {
  dayButtons.forEach(tab => {
    const selected = tab === button;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  document.querySelector('#day-panel').setAttribute('aria-labelledby', button.id);
  rows.replaceChildren(...week[button.dataset.day].map(([time, period, title, description]) => {
    const article = document.createElement('article'); article.className = 'class-row';
    const clock = document.createElement('time'); clock.textContent = time;
    const suffix = document.createElement('span'); suffix.textContent = period; clock.append(suffix);
    const copy = document.createElement('div');
    const heading = document.createElement('h3'); heading.textContent = title;
    const note = document.createElement('p'); note.textContent = description; copy.append(heading, note);
    const pick = document.createElement('button'); pick.type = 'button'; pick.dataset.pick = title;
    pick.setAttribute('aria-label', `Choose ${title}`); pick.textContent = '↗';
    article.append(clock, copy, pick); return article;
  }));
  rows.classList.remove('rows-enter');
  if (!motionPaused()) { void rows.offsetWidth; rows.classList.add('rows-enter'); }
}
dayButtons.forEach((button, index) => {
  button.addEventListener('click', () => selectDay(button));
  button.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % dayButtons.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + dayButtons.length) % dayButtons.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = dayButtons.length - 1;
    if (next !== undefined) { event.preventDefault(); selectDay(dayButtons[next]); dayButtons[next].focus(); }
  });
});

const form = document.querySelector('#entry-form');
const firstStep = document.querySelector('#step-one');
const secondStep = document.querySelector('#step-two');
const result = document.querySelector('#ticket-result');
const stepLabel = document.querySelector('#step-label');
const dots = document.querySelectorAll('.step-marker i');
const nameField = form.elements.guestName;
const phoneField = form.elements.guestPhone;
const nextButton = document.querySelector('#next-step');
let currentStep = 1;
function showStep(step, focus = true) {
  currentStep = step;
  firstStep.hidden = step !== 1;
  secondStep.hidden = step !== 2;
  result.hidden = true;
  stepLabel.textContent = step === 1 ? '01 / FIND YOUR VIBE' : '02 / SAY HELLO';
  dots.forEach((dot, index) => dot.classList.toggle('active', index < step));
  if (step === 2) {
    document.querySelector('#selected-vibe').textContent = `YOUR PICK: ${form.elements.vibe.value.toUpperCase()}`;
    if (focus) document.querySelector('#details-heading').focus({ preventScroll: true });
  } else if (focus) nextButton.focus({ preventScroll: true });
}
nextButton.addEventListener('click', () => showStep(2));
document.querySelector('#back-step').addEventListener('click', () => showStep(1));
document.querySelector('#start-again').addEventListener('click', () => { form.reset(); showStep(1); });
document.addEventListener('click', event => {
  const pick = event.target.closest('[data-pick]');
  if (!pick) return;
  showStep(1, false);
  for (const radio of form.elements.vibe) radio.checked = radio.value === pick.dataset.pick;
  form.scrollIntoView({ behavior: motionPaused() ? 'instant' : 'smooth', block: 'center' });
  nextButton.focus({ preventScroll: true });
});
[nameField, phoneField].forEach(input => input.addEventListener('input', () => input.setCustomValidity('')));
form.addEventListener('submit', event => {
  event.preventDefault();
  if (currentStep === 1) { showStep(2); return; }
  if (currentStep !== 2) return;
  nameField.setCustomValidity(nameField.value.trim().length >= 2 ? '' : 'Please enter at least two characters for your name.');
  const phone = phoneField.value.trim();
  const count = phone.replace(/\D/g, '').length;
  phoneField.setCustomValidity(/^\+?[\d\s().-]+$/.test(phone) && count >= 10 && count <= 15 ? '' : 'Please enter a valid number with 10–15 digits.');
  if (!form.reportValidity()) return;
  form.reset(); currentStep = 3;
  firstStep.hidden = true; secondStep.hidden = true; result.hidden = false;
  stepLabel.textContent = 'DEMO COMPLETE / GOOD ENERGY AHEAD';
  result.focus({ preventScroll: true });
});
nextButton.disabled = false;

const loadMap = document.querySelector('#load-map');
loadMap.addEventListener('click', () => {
  const map = document.createElement('iframe');
  map.title = 'Example neighbourhood: Jubilee Hills, Hyderabad';
  map.src = 'https://maps.google.com/maps?q=Road%2036%20Jubilee%20Hills%20Hyderabad&z=14&output=embed';
  map.referrerPolicy = 'no-referrer-when-downgrade';
  map.allowFullscreen = true;
  map.tabIndex = 0;
  document.querySelector('#map-shell').replaceChildren(map);
  map.focus();
});
