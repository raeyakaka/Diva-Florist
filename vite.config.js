import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Saat development, request /api diteruskan ke Laravel (php artisan serve) di port 8000
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': 'http://127.0.0.1:8000' } },
})
