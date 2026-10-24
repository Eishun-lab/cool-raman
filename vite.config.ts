import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './', // 相対パス指定により、Vercel / GitHub Pages / どこでも同一ビルドで動作可能
  server: {
    port: 5174,
    open: true
  }
});

