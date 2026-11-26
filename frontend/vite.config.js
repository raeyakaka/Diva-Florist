import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Saat development, request /api diteruskan ke Laravel (php artisan serve) di port 8000
export default defineConfig({
  base: '/Diva-Florist/',
  plugins: [react()],
  server: { allowedHosts: true, proxy: { '/api': 'http://127.0.0.1:8000' } },
})
