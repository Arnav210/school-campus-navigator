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

## Proprietary License & Intellectual Property Tracking

This software and all accompanying documentation files are proprietary and confidential. 

**All Rights Reserved.** Unauthorized copying, modification, distribution, hosting, or reproduction of this software via any medium is strictly prohibited. The source code is made public exclusively for collegiate application portfolio review and verification of development timestamps.

---
*Developed independently by Arnav210. Chronological version history cryptographically signed and tracked via Git.*
