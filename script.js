const content={registration:{description:'A scan starts their membership journey. Leave the registration forms behind.',alt:'QR registration stand on a gym reception desk'},attendance:{description:'Record member visits through biometric check-in. Keep the attendance register off the desk.',alt:'Biometric fingerprint attendance device at a gym'},workouts:{description:'Send members their workout schedule on WhatsApp, ready for their next session.',alt:'A workout schedule displayed on a phone'},billing:{description:'Send bills automatically on WhatsApp, so every payment comes with a clear record.',alt:'A membership invoice displayed on a phone'}};
const tabs=[...document.querySelectorAll('[role="tab"]')];function selectTab(tab){tabs.forEach(t=>{const selected=t===tab;t.classList.toggle('active',selected);t.setAttribute('aria-selected',String(selected));t.tabIndex=selected?0:-1});const key=tab.dataset.feature;const img=document.getElementById('feature-image');img.src=`assets/${key}.webp`;img.alt=content[key].alt;document.getElementById('feature-description').textContent=content[key].description;document.getElementById('feature-panel').setAttribute('aria-labelledby',tab.id)}tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectTab(tab));tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowDown')next=(i+1)%tabs.length;if(e.key==='ArrowUp')next=(i+tabs.length-1)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();selectTab(tabs[next]);tabs[next].focus()}})});
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
