// Demo requests are submitted to the GymCodex API.
const demoModal=document.getElementById('demo-modal');
const demoForm=document.getElementById('demo-form');
const demoName=document.getElementById('demo-name');
const demoPhone=document.getElementById('demo-phone');
const demoStatus=document.getElementById('demo-ui-status');
const demoSubmit=demoForm.querySelector('button[type="submit"]');
const demoSubmitLabel=demoSubmit.innerHTML;
let demoPending=false;
let demoGeneration=0;
let demoTrigger=null;
document.querySelectorAll('[data-demo-open]').forEach(button=>button.addEventListener('click',()=>{demoTrigger=button;demoStatus.hidden=true;demoModal.showModal();document.body.classList.add('modal-open');}));
function closeDemo(){demoModal.close();}
document.getElementById('demo-modal-close').addEventListener('click',closeDemo);
demoModal.addEventListener('click',event=>{if(event.target===demoModal){const r=demoModal.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeDemo();}});
demoModal.addEventListener('close',()=>{demoGeneration++;document.body.classList.remove('modal-open');demoForm.reset();demoName.setCustomValidity('');demoPhone.setCustomValidity('');demoStatus.hidden=true;demoTrigger?.focus();});
function validateDemo(){demoName.setCustomValidity(demoName.value.trim().length>=2?'':'Please enter your name.');const digits=demoPhone.value.replace(/\D/g,'');const allowed=/^\+?[\d\s().-]+$/.test(demoPhone.value.trim());demoPhone.setCustomValidity(allowed&&digits.length>=10&&digits.length<=15?'':'Please enter a valid phone number with 10 to 15 digits.');}
[demoName,demoPhone].forEach(input=>input.addEventListener('input',()=>{validateDemo();demoStatus.hidden=true;}));
demoForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (demoPending) return;
  validateDemo();
  if (!demoForm.reportValidity()) return;

  const name = demoName.value.trim();
  const phone = demoPhone.value.trim();
  const generation = demoGeneration;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  demoPending = true;
  demoSubmit.disabled = true;
  demoSubmit.textContent = 'Sending…';
  demoName.readOnly = true;
  demoPhone.readOnly = true;
  demoForm.setAttribute('aria-busy', 'true');
  demoStatus.textContent = 'Sending your demo request…';
  demoStatus.hidden = false;

  try {
    const response = await fetch('https://api.gymcodex.com/landingWebsiteForm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ name, phone }),
      signal: controller.signal
    });
    if (!response.ok) throw new Error('Request failed');
    // Accept empty successful responses as well as JSON responses.
    const text = await response.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { /* No JSON response required. */ }
    if (data?.success === false) throw new Error('Request rejected');
    if (generation !== demoGeneration) return;

    if (typeof gtag === 'function') {
  gtag('event', 'generate_lead', {
    form_name: 'demo_request'
  });
}


    demoForm.reset();
    demoName.setCustomValidity('');
    demoPhone.setCustomValidity('');
    demoStatus.textContent = 'Thank you! Your demo request has been submitted. We’ll contact you to arrange a time.';


  } catch (error) {
    if (generation !== demoGeneration) return;
    demoStatus.textContent = error.name === 'AbortError'
      ? 'The request timed out. We couldn’t confirm whether it was received. Please try again later.'
      : 'We couldn’t confirm your request. Please check your connection and try again.';
  } finally {
    clearTimeout(timeout);
    demoPending = false;
    demoSubmit.disabled = false;
    demoSubmit.innerHTML = demoSubmitLabel;
    demoName.readOnly = false;
    demoPhone.readOnly = false;
    demoForm.removeAttribute('aria-busy');
  }
});

// Enhance the readable feature list into a manually controlled card deck.
const operationsDeck = document.getElementById('operations-deck');
if (operationsDeck) {
  const cards = [...operationsDeck.querySelectorAll('.core-card')];
  const position = document.getElementById('operations-position');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let animating = false;
  let gesture = null;

  function renderDeck() {
    cards.forEach((card, index) => {
      const depth = (index - active + cards.length) % cards.length;
      card.dataset.depth = depth;
      card.style.zIndex = cards.length - depth;
      card.style.removeProperty('transform');
      card.classList.toggle('is-active', depth === 0);
      card.inert = depth !== 0;
      card.setAttribute('aria-hidden', String(depth !== 0));
      card.setAttribute('role', 'group');
      card.setAttribute('aria-roledescription', 'slide');
      card.setAttribute('aria-label', `${index + 1} of ${cards.length}`);
    });
    position.textContent = `${String(active + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
  }

  async function showCard(index, direction = 1) {
    if (animating) return;
    const target = (index + cards.length) % cards.length;
    if (target === active) return;
    animating = true;
    const outgoing = cards[active];
    if (outgoing.contains(document.activeElement)) operationsDeck.focus({ preventScroll: true });
    if (!reducedMotion.matches) {
      const animation = outgoing.animate([
        { transform: getComputedStyle(outgoing).transform, opacity: 1 },
        { transform: `translateX(${-direction * operationsDeck.clientWidth * .65}px) rotate(${-direction * 6}deg)`, opacity: 0 }
      ], { duration: 240, easing: 'ease-in', fill: 'forwards' });
      try { await animation.finished; } catch { /* Settle on the selected card if interrupted. */ }
      active = target;
      renderDeck();
      animation.cancel();
    } else {
      active = target;
      renderDeck();
    }
    animating = false;
  }

  function clearGesture() {
    if (!gesture) return;
    const pointerId = gesture.id;
    gesture = null;
    operationsDeck.classList.remove('is-dragging');
    cards[active].style.removeProperty('transform');
    if (operationsDeck.hasPointerCapture(pointerId)) operationsDeck.releasePointerCapture(pointerId);
  }

  document.querySelector('[data-deck-prev]').addEventListener('click', () => showCard(active - 1, -1));
  document.querySelector('[data-deck-next]').addEventListener('click', () => showCard(active + 1));
  operationsDeck.addEventListener('keydown', event => {
    if (event.target !== operationsDeck) return;
    const destinations = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: cards.length - 1 };
    if (!(event.key in destinations)) return;
    event.preventDefault();
    clearGesture();
    showCard(destinations[event.key], event.key === 'ArrowLeft' || event.key === 'Home' ? -1 : 1);
  });
  operationsDeck.addEventListener('pointerdown', event => {
    if (animating || gesture || !event.isPrimary || event.button !== 0 || event.target.closest('button, a')) return;
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, dx: 0, horizontal: false };
    operationsDeck.setPointerCapture(event.pointerId);
  });
  operationsDeck.addEventListener('pointermove', event => {
    if (!gesture || event.pointerId !== gesture.id) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    if (!gesture.horizontal) {
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { clearGesture(); return; }
      if (Math.abs(dx) < 10) return;
      gesture.horizontal = true;
      operationsDeck.classList.add('is-dragging');
    }
    gesture.dx = dx;
    if (!reducedMotion.matches) {
      const distance = Math.max(-operationsDeck.clientWidth, Math.min(operationsDeck.clientWidth, dx));
      cards[active].style.transform = `translateX(${distance}px) rotate(${distance / operationsDeck.clientWidth * 5}deg)`;
    }
  });
  operationsDeck.addEventListener('pointerup', event => {
    if (!gesture || event.pointerId !== gesture.id) return;
    const { dx, horizontal } = gesture;
    const threshold = Math.min(90, operationsDeck.clientWidth * .18);
    // Start the exit from the dragged position before clearing the pointer state.
    if (horizontal && Math.abs(dx) > threshold) showCard(active + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    clearGesture();
  });
  operationsDeck.addEventListener('pointercancel', clearGesture);
  operationsDeck.addEventListener('lostpointercapture', clearGesture);
  window.addEventListener('blur', clearGesture);

  operationsDeck.classList.add('deck-ready');
  operationsDeck.tabIndex = 0;
  operationsDeck.setAttribute('aria-roledescription', 'carousel');
  operationsDeck.setAttribute('aria-describedby', 'operations-hint');
  document.querySelector('.deck-toolbar').hidden = false;
  renderDeck();
}
