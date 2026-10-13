# GymCodex website

Includes all HTML, CSS, JavaScript and images, with pricing and the popup demo form.

## Run
From this directory: python3 -m http.server 8000
Open http://localhost:8000. No build or installation is required.

## Demo API
The submit handler in script.js sends POST https://api.gymcodex.com/landingWebsiteForm
Headers: Content-Type: application/json; Accept: application/json
Body: { "name": "...", "phone": "..." }

It validates inputs, prevents duplicate submissions while pending, times out after 20 seconds, preserves entered details on failure, and displays confirmation after a successful HTTP response (unless JSON explicitly contains success: false).

The backend is responsible for email delivery. Configure CORS on your API to allow your deployed website origin, POST and OPTIONS, and the Content-Type and Accept headers. Include localhost if you want local testing. Do not rely on opening index.html via file:// for API testing.

Sending logic was checked with mocked success/error responses. No live lead was submitted during testing.

## Deploy
Upload index.html, style.css, script.js and assets/ to your static host, preserving relative paths. If updating the previous complete site, replace script.js and style.css.

Google Fonts requires internet access; fallback fonts are configured.

## Gym website demo

Open http://localhost:8000/demo/1/ for the standalone FORM Athletic Club concept. This single-location gym website has its own visual identity, CSS, and JavaScript, independent of the GymCodex marketing site. Deploy the complete `demo/` directory; no build is needed.

The page centres on a complimentary first-session offer, with training options, a first-visit walkthrough, an inline enquiry demo, FAQs, one Indiranagar neighbourhood map, and mobile quick actions. The form validates a trimmed name and a 10–15 digit phone number, then displays an explicit demo confirmation; it never transmits or persists entered details. Replace illustrative gym content, the offer, contact details, and map before live use, and connect a real enquiry backend before accepting bookings. The masked phone and reserved `.example` email are placeholders.

Google Maps and Google Fonts require network access. An external neighbourhood map link is available if the embed cannot load. The photo-led design uses locally stored Unsplash images: `gym.jpg` (`1534438327276-14e5300c3a48`), `training.jpg` (`1517836357463-d25dfeac3438`), `strength.jpg` (`1534258936925-c58bed479fcb`), and `movement.jpg` (`1518611012118-696072aa579a`). These are illustrative stock photos. Below-the-fold images load lazily; the full-width hero image loads with high priority.

## Legal pages
privacy-policy.html and terms.html retain the supplied policy content and July 20, 2025 dates. legal.css styles those pages. Home-page footer links and policy cross-links use relative paths. Deploy all files together.
