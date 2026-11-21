import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves the site from /<repo-name>/
export default defineConfig({
  base: '/her-little-english-journey/',
  plugins: [react()],
  test: {
    environment: 'node',
  },
} as any);
