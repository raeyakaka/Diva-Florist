import axios from 'axios'

// Satu-satunya titik komunikasi React -> Laravel (REST API, format JSON)
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { Accept: 'application/json' },
})

// Token admin (Laravel Sanctum) otomatis dikirim bila sudah login
api.interceptors.request.use((c) => {
  const t = localStorage.getItem('dv-admin')
  if (t) c.headers.Authorization = 'Bearer ' + t
  return c
})
