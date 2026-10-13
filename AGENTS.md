# GymCodex project guide

## Purpose and scope

This repository contains the public GymCodex gym SaaS marketing website. Its main goal is to explain the product and collect requests for a free demo. The actual gym management application and API backend are not implemented here.

The site uses plain HTML, CSS, and browser JavaScript. There is no package manifest, dependency installation, bundler, or automated test suite. Keep this simple architecture unless the task explicitly calls for changing it.

## File map

| File | Responsibility |
| --- | --- |
| `index.html` | Landing page, navigation, feature tabs, pricing, demo dialog, and footer |
| `style.css` | Shared design tokens, landing-page layout, responsive rules, pricing, and dialog styles |
| `script.js` | Feature-tab interactions, demo dialog lifecycle, validation, API submission, and lead analytics |
| `privacy-policy.html` | Privacy policy with its own header/footer and analytics snippet |
| `terms.html` | Terms and conditions with their own header/footer and analytics snippet |
| `legal.css` | Legal-page styles, loaded after `style.css` |
| `assets/` | WebP branding, gym photography, product illustrations, and dashboard images |
| `demo/1/` | Standalone single-location FORM Athletic Club demo, isolated CSS/JS, and local photo |
| `README.md` | Local serving, API contract, and deployment notes |
| `CNAME` | Custom domain: `www.gymcodex.com` |
| `_config.yml` | Jekyll configuration with `theme: minima`; local preview requires no Jekyll build |
| `.github/` | GitHub Pages learning-step workflows and instructions, plus Actions Dependabot configuration; not application tests |

## Page content and product positioning

The landing page runs from the “Less admin. More gym.” hero through everyday features (`#simplify`), body composition (`#progress`), WhatsApp messaging, the dashboard (`#overview`), pricing (`#pricing`), and the final demo invitation (`#demo`).

Current published copy offers a starting plan from ₹10,000/year plus applicable taxes, billed annually, a smart scale included at no extra cost, and a one-week software trial. Premium plans use contact-based pricing. Starting-plan WhatsApp receipts and renewal reminders are distinct from premium WhatsApp marketing integration. Staff shifts, tasks/follow-ups, payslips, marketing features, and a member app are advertised across premium tiers. Treat these as existing copy, not independently verified product facts; do not invent or silently change commercial promises.

## JavaScript behavior to preserve

### Feature explorer

- The four feature keys are `registration`, `attendance`, `workouts`, and `billing`.
- Each tab's `data-feature` maps to the `content` object in `script.js` and `assets/<key>.webp`.
- Selection updates the image, alt text, description, active class, `aria-selected`, roving `tabIndex`, and panel `aria-labelledby`.
- The vertical tab list supports click, ArrowUp, ArrowDown, Home, and End. Keep markup, content keys, IDs, and asset filenames in sync.

### Demo dialog and form

- All `[data-demo-open]` buttons open the same native `<dialog id="demo-modal">`.
- Close button, outside-dialog click, and native Escape behavior close the dialog. Closing resets the form and validity messages, removes the body scroll lock, and restores focus to the opening button.
- The script assumes landing-page DOM elements exist and is loaded at the end of `index.html`. Do not load it on legal pages without adding appropriate guards.
- Names must contain at least two characters after trimming. Phone validation allows an optional leading `+`, digits, whitespace, parentheses, dots, and hyphens, with 10–15 digits total. HTML also sets input length constraints.
- Submission sends `POST https://api.gymcodex.com/landingWebsiteForm` with `Content-Type: application/json`, `Accept: application/json`, and body `{ "name": "...", "phone": "..." }`. Values are trimmed; the phone number is not normalized to digits only.
- While pending, duplicate submits are blocked, the button is disabled, inputs are read-only, and the form uses `aria-busy` with a visible status message.
- An `AbortController` imposes a 20-second timeout. Non-2xx responses and JSON containing `success: false` fail. Empty or non-JSON successful HTTP responses are accepted.
- Success resets the inputs and shows confirmation. Failures retain entered values while the dialog remains open and show a connection or timeout message.
- `demoGeneration` suppresses stale result messages after the dialog closes. Closing does not immediately abort an in-flight request; pending state is cleared in `finally`.
- Backend email delivery and CORS configuration are outside this repository. Do not add credentials or client-side email delivery.

### Analytics

All three HTML pages load Google Analytics with measurement ID `G-7695VWHVXK`. A successful demo submission emits `generate_lead` with `form_name: 'demo_request'` when `gtag` exists. Preserve the success-only event behavior and keep names and phone numbers out of analytics payloads.

## Design and editing conventions

- Preserve the yellow (`#ffda00`), dark ink (`#171817`), white, and green visual palette defined in `:root`.
- Typography uses Google Fonts: Barlow Condensed for prominent headings and DM Sans for body text, with fallback fonts.
- The design uses large condensed headings, photographic/product imagery, alternating light/dark sections, and strong demo calls to action.
- Main responsive breakpoints are 1000px and 650px, with additional wide-screen rules. Navigation is hidden at 1000px and below.
- `style.css` contains later overrides for the immersive hero and narrow-screen overflow fixes. Read the full cascade before modifying an earlier rule.
- Retain keyboard focus indicators, tab semantics, dialog labels, input labels, status announcements, reduced-motion handling, descriptive alt text, and mobile dialog scrolling.
- Preserve relative asset and page URLs. Legal pages share `style.css`, so check them after changing global selectors.
- HTML and parts of CSS/JS are densely formatted. Make focused changes and avoid unrelated whole-file reformatting.
- Preserve supplied legal wording and July 20, 2025 dates unless the task calls for updating them. The privacy policy currently says no tracking technologies are used while the HTML loads Google Analytics; this is an existing content discrepancy, not a resolved or verified compliance claim.
- Update this guide and `README.md` when architecture, setup, API behavior, or deployment requirements change. Preserve unrelated user changes in the working tree.

## Local preview and validation

Run from the repository root:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`. Use HTTP rather than `file://` for form testing. Google Fonts and external integrations require network access; a local server alone does not establish backend CORS support.

For relevant UI or behavior changes, check:

1. Desktop and narrow mobile layouts, especially the hero, pricing, and dialog, for horizontal overflow.
2. Feature tabs using both pointer and keyboard; confirm image and caption updates.
3. Demo opening from different buttons, close/Escape/backdrop behavior, focus return, validation, and scroll locking.
4. With mocked API responses, success, explicit `success: false`, HTTP/network failure, timeout, duplicate submission, and closing/reopening while pending. Avoid sending real leads during routine tests.
5. Legal-page navigation, relative assets, and browser console errors.

There are no npm build/test commands. Documentation-only edits need a diff/content review rather than browser regression tests. Report which checks actually ran; do not present README descriptions of past testing as new test results.

## Deployment context

The `/demo/1/` route is an independent FORM Athletic Club gym marketing concept with its own cream, forest, and orange visual identity and typography; the main site's palette does not apply to it. Keep it focused on one illustrative Indiranagar location and a first-session enquiry. Its local-only form validates inputs and shows an explicit demo confirmation without transmitting or persisting personal data. Offers, amenities, hours, and contacts are illustrative; retain that distinction. Deploy the complete `demo/` directory. Google Maps needs network access and has an external map-link fallback. Do not load the main lead-form script here.

The repository includes GitHub Pages configuration and a custom domain, but live hosting settings are not established by these files alone. Deploy the landing page, both legal pages, both stylesheets, `script.js`, and `assets/` together, preserving paths. Keep domain configuration intact unless the task concerns hosting changes.
