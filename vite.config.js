import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/calendrier-chantier/', // ⚠️ Remplacer par le nom exact de ton repository GitHub
})
