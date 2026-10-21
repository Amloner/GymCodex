# GymCodex website

Includes all HTML, CSS, JavaScript and images, with pricing and the popup demo form.

The landing page retains the photographic hero, followed by four overlapping, swipeable cards for billing, renewals, check-ins, and staff permissions. The deck supports touch swipes, mouse drags, looping previous/next buttons, and Arrow/Home/End keys when focused. Vertical touch scrolling and reduced-motion preferences are respected. Covered cards are inert and hidden from screen readers. No carousel dependency is required; without JavaScript all four cards appear as a readable static list.

Smart scale reports, WhatsApp automation, a standalone dashboard section, and pricing follow in that order. Original billing, attendance, gym, scale, WhatsApp, and dashboard assets are reused; the dashboard has its own yellow section and navigation anchor; posture assessment details are expandable. Testimonials are currently omitted. Posture plan availability remains unverified and is not included in the starting-plan list. Pricing retains applicable taxes and annual billing, with the requested seven-day, no-credit-card trial copy.

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

Open http://localhost:8000/demo/1/ for BASELINE, a mobile-first, single-location gym concept with an independent blue/white visual identity. Its HTML, CSS, and JavaScript are self-contained; there is no build or backend dependency. Deploy the complete `demo/1/` directory with the main site.

The page includes a photographic hero, training stories, a three-photo gallery with manual controls, one Anna Nagar neighbourhood map, FAQs, and a native visit-request dialog. The dialog validates a trimmed name and a 10–15 digit phone number and shows a clearly labelled demo completion. It does not send, log, or persist the entered details. Closing resets the dialog and restores focus. Replace the fictional brand, facilities, hours, contacts, and map location, and connect a real enquiry backend before live use. The masked phone and reserved `.example` email are placeholders.

Google Fonts and Google Maps require network access; a separate neighbourhood-map link provides an alternative to the embedded map. The current design uses new stock photography from Unsplash, stored locally in `demo/1/media/`: `lift.jpg` (`1581009146145-b5ef050c2e1e`), `club.jpg` (`1534368270820-9de3d8053204`), `coach.jpg` (`1571019613454-1cb2f99b2d8b`), and `space.jpg` (`1593079831268-3381b0db4a77`). The hero loads with high priority and other initial images load lazily.

## Animated gym demo 2

Open http://localhost:8000/demo/2/ for **OFFBEAT Movement Club**, a separate mobile-first concept. It has its own HTML, CSS, JavaScript, and four local photos in `demo/2/images/`; it does not import demo 1's files. Deploy the complete directory, with no build step.

The design uses a lilac/pink collage, animated headline entrance, floating photo, rotating stickers, a scrolling marquee, scroll reveals, reading progress, pointer-responsive photo tilt, and a native horizontally scrolling workout rail. The top motion control pauses animation; system reduced-motion settings disable it by default. Workout navigation and schedule day tabs work with keyboard controls. Sample schedule selections prefill the two-step guest-list form. Validation is local, with no submissions or persistence; the result explicitly says no booking was made. The map loads only when requested, and an external directions link is always available.

OFFBEAT and its Jubilee Hills location, contact details, schedule, and amenities are fictional. Replace them and connect a real backend before using the form for actual enquiries. New stock photos are from Unsplash: `power.jpg` (`1549476464-37392f717541`), `sweat.jpg` (`1599058917212-d750089bc07e`), `rhythm.jpg` (`1518609878373-06d740f60d8b`), and `studio.jpg` (`1540497077202-7c8a3999166f`). Fonts and maps require network access.

## Legal pages
privacy-policy.html and terms.html retain the supplied policy content and July 20, 2025 dates. legal.css styles those pages. Home-page footer links and policy cross-links use relative paths. Deploy all files together.
