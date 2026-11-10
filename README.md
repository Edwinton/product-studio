# Product Studio

A 5-page static web app built for the Product Development, Design & AI Systems internship assignment. It covers all three tasks in one cohesive product, with no build step and no dependencies.

## Pages

| File | Covers | Highlights |
| --- | --- | --- |
| `index.html` | Overview | Deliverables summary, interactive settings demo |
| `practo.html` | Task 1: Practo for Animals MVP | Search, type chips, filters, provider cards, 4 CTAs |
| `education.html` | Task 2: AI Education landing page | Hero, programmes, journey, validated lead form |
| `carousel.html` | Task 3: Sample Carousel | 7-slide carousel, swipe/arrow navigation, copyable caption |
| `workflow.html` | Task 3: AI Workflow | 6-stage pipeline, tool stack, Make scenario |

## Features

- **Interactive Display Settings:** Floating drawer (⚙ top right) to toggle dark mode, accent colors, density, corner radius, and motion. Persists via `localStorage`.
- **3D Card Effects:** Physics-based 3D tilt, parallax pop, spotlight glow, and magnetic buttons via `effects.js`.
- **No Dependencies:** Pure HTML, CSS, and vanilla JavaScript. Works offline from `file://`.
- **Templates:** Uses `<template>` tags to render provider cards, programme cards, and carousel slides dynamically.

## Run Locally

1. Clone the repo or download the ZIP.
2. Open `index.html` in any modern browser (Chrome, Edge, Firefox, Safari).

## Deploy to GitHub Pages

1. Push this folder to a GitHub repository.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set Source to **Deploy from a branch**.
4. Select the `main` branch and `/ (root)` folder, then click **Save**.
5. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

## Placeholders

Provider names, phone numbers, testimonials, prices, and the AI Education figures are illustrative demo data.
