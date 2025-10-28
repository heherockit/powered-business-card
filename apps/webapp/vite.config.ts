/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    open: false,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['src/tests/setup.ts'],
    globals: true,
  },
});
