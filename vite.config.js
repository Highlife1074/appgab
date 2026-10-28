import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// `base` doit correspondre au nom du dépôt GitHub pour GitHub Pages.
export default defineConfig({
  base: '/appgab/',
  plugins: [react(), tailwindcss()],
})
