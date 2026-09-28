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

## Legal pages
privacy-policy.html and terms.html retain the supplied policy content and July 20, 2025 dates. legal.css styles those pages. Home-page footer links and policy cross-links use relative paths. Deploy all files together.
