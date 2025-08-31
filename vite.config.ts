import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: [
      '.loca.lt'
    ]
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
        }
      }
    }
  }
})