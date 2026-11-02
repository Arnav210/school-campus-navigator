# Del Norte High School Campus Navigation PWA

A serverless, client-side Progressive Web Application (PWA) designed to alleviate transition anxiety for incoming freshmen at Del Norte High School (DNHS). 

The application accepts image uploads or screenshots of unstructured student schedules, processes the text natively on-device, and maps out chronological, obstacle-avoiding transit routes across the campus footprint without relying on an external database backend or central servers.

## Core Architectural Features

*   **Client-Side Identity Session:** Bypasses friction-heavy traditional login gates using a non-intrusive modal overlay. Onboarding configurations persist using browser-native `localStorage`.
*   **High-Fidelity Spatial Mapping:** Integrates a mobile-responsive vector canvas centered precisely on the geographic coordinates of the Del Norte High School campus layout.
*   **Obstacle-Avoiding Pathfinding Engine:** Manages a localized node-waypoint graph system inside static data modules to route students along open outdoor walkways, avoiding building structures.
*   **On-Device Computer Vision (OCR):** Utilizes `Tesseract.js` to execute character recognition loops directly inside the client's smartphone browser to parse raw text streams from schedule photos.
*   **Serverless LLM Orchestration:** Pipelines chaotic schedule text into structured JSON arrays matching validated campus map node coordinates via serverless API integrations.
*   **DNHS Bell Schedule Widget:** Features a persistent real-time banner tracking passing period countdown constraints using standard internal JavaScript interval clocks.

## Built With

*   **React + Vite** - Frontend framework and local compilation engine
*   **Leaflet & React-Leaflet** - Mobile-friendly interactive mapping modules
*   **Tesseract.js** - On-device Convolutional Neural Network (CNN) for OCR processing
*   **GitHub Actions** - Automated CI/CD production build compilation pipeline

## Deploying and checking updates

Run `npm test` and `npm run lint` before pushing to `main`. The Deploy to GitHub Pages
workflow builds and publishes `dist`; it can also be started manually in Actions.
GitHub Settings → Pages → Source must be set to **GitHub Actions**.

The production build generates `sw.js` with a versioned cache containing the HTML
and its matching JavaScript and CSS. Online navigation fetches current HTML;
offline navigation uses the complete cached build. New workers activate immediately
and the app reloads when its worker changes. Worker registration uses the Vite base
path so it also works when the installed app opens directly at `/map`.

Browsers with the original `dnhs-navigator-v1` worker may still show a blank page
after this fix is deployed. Close and reopen the app, then reload once the new
worker has installed. If needed, in browser DevTools → Application → Service
Workers, unregister the worker for this site and reload. Schedule and profile data
in localStorage are preserved; clearing all site data is unnecessary.

## Proprietary License & Intellectual Property Tracking

This software and all accompanying documentation files are proprietary and confidential. 

**All Rights Reserved.** Unauthorized copying, modification, distribution, hosting, or reproduction of this software via any medium is strictly prohibited. The source code is made public exclusively for collegiate application portfolio review and verification of development timestamps.

---
*Developed independently by Arnav210. Chronological version history cryptographically signed and tracked via Git.*
