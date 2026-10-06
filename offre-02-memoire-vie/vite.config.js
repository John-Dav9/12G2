import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base relative : le site construit peut être servi depuis n'importe quel dossier (GitHub Pages, Cloudflare…)
export default defineConfig({
  plugins: [react()],
  base: './',
})
