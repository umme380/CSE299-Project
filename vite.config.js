import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,      // Force port 5173
    strictPort: true, // If 5173 is busy, FAIL instead of switching to 5174
  }
})