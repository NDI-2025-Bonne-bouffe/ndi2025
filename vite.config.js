import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/ndi2025/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        alternatives: resolve(__dirname, 'alternatives.html'),
        ecology: resolve(__dirname, 'ecology.html'),
        opensource: resolve(__dirname, 'opensource.html'),
      },
    },
  },
});
