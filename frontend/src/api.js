import axios from 'axios'
import { demoAdapter } from './demo'

// Mode demo aktif otomatis bila website di-build (production) TANPA alamat backend.
// Isi VITE_API_URL untuk memakai backend Laravel yang asli.
export const DEMO = import.meta.env.PROD && !import.meta.env.VITE_API_URL

// Satu-satunya titik komunikasi React -> Laravel (REST API, format JSON)
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { Accept: 'application/json' },
  ...(DEMO ? { adapter: demoAdapter } : {}),
})

// Token admin (Laravel Sanctum) otomatis dikirim bila sudah login
api.interceptors.request.use((c) => {
  const t = localStorage.getItem('dv-admin')
  if (t) c.headers.Authorization = 'Bearer ' + t
  return c
})
