import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist' // This should match your output directory
  },
  base: '/', // Ensures proper path resolution for Vercel deployment
})
