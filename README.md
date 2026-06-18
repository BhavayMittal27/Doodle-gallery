# DoodlePort | Sketch Resume & Interactive Gallery

An interactive web application built with a premium hand-drawn "doodle" aesthetic. This project showcases a developer portfolio, interactive drawing canvases, and technical skill timeline roads, blending layout wireframes with front-end animations.

## 🎨 Live Demo & Preview
- **Live Website:** [DoodlePort Portfolio](https://BhavayMittal27.github.io/Doodle-gallery/)
- **Local Dev Server:** `http://localhost:5173/`
- **Dual Themes:** Swap between **Warm Sketchbook Paper** (light) and **Slate Chalkboard** (dark) styles dynamically.

---

## ⚡ Features

### 1. The Sketch Studio (Drawing Canvas)
- **Fluid Painting:** Support for brush sizes, highlighter opacities, and organic erasing.
- **Vector Shapes:** Interactive tools for freehand sketches, straight lines, rectangles, and circular nodes.
- **History Buffers:** 25-step Undo (`Ctrl+Z`) and Redo (`Ctrl+Y`) states.
- **Raster Composite Exporter:** Custom canvas merging that stamps raw drawings onto high-fidelity background textures (lined paper or chalkboard slate) for downloads and gallery posts.

### 2. Interactive Doodle Gallery
- **Preloaded Architecture Sketches:** Beautifully rendered SVG wireframes depicting microservices database sync, weather widgets, and classic game console UI platforms.
- **Interactive Likes:** Tap the heart icon to trigger likes on cards, syncing dynamically with lightbox states.
- **Lightbox Details Modal:** Fullscreen zoom and descriptions of tech stacks and features.
- **Search & Filter:** Category tabs (`All`, `My Projects`, `User Doodles`) and real-time text query filtering.

### 3. Sketchbook Resume Sections
- **Interactive Tabs:** Jump between Profile page, circular skill percentages, and experience milestones.
- **Vector Timelines:** Clickable timeline roads with custom icons.
- **Circular Progress Meters:** Self-filling progress loops that animate when loaded.

### 4. Interactive Hero Mini Canvas
- A small scratchpad on the landing section for instant drawing and quick testing.

---

## 🛠️ Technology Stack
- **Core:** Semantic HTML5, Canvas API, Vector SVGs.
- **Styling:** CSS variables, wobbly SVG displacement filters (`feTurbulence`, `feDisplacementMap`), keyframe animations.
- **Logic:** Vanilla JS (ES6 Modules) - lightweight, dependency-free code.
- **Hosting Tools:** Vite (Dev Server & Build bundler), `gh-pages` (Deployment scripts).

---

## 🚀 How to Run Locally

1. **Install Dependencies:**
   ```bash
   npm install
   ```
2. **Start Development Server:**
   ```bash
   npm run dev
   ```
3. **Build Production Assets:**
   ```bash
   npm run build
   ```
4. **Preview Production Build:**
   ```bash
   npm run preview
   ```

---

## 📦 Deployment Instructions

### GitHub Pages (Built-in)
Deploy directly from your command line:
```bash
npm run deploy
```
*Note: Vite base paths are configured relatively (`base: './'`), meaning it works on repository subfolders automatically!*

### Vercel / Netlify
1. Connect your repository to your dashboard.
2. Set Build Command: `npm run build`
3. Set Output Directory: `dist`
4. Click Deploy.