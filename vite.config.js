import { defineConfig } from 'vite';

export default defineConfig({
  // Set relative base path so the app works on both root domains (Vercel/Netlify)
  // and repository subfolders (GitHub Pages) automatically.
  base: './',

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Avoid bundling SVGs as base64 to keep drawings clean
    assetsInlineLimit: 0,
  }
});
