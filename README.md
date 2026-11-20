# Diva Florist – React + Laravel

```
diva-florist/
├── frontend/   React (Vite) – tampilan toko
└── backend/    Kode Laravel 11 – ditimpa ke proyek Laravel baru (lihat langkah 1)
```

## Cara tercepat: GitHub Codespaces
1. Upload isi folder ini ke repository GitHub baru.
2. Klik **Code → Codespaces → Create codespace**. Tunggu setup otomatis selesai (backend + npm install).
3. Terminal 1: `cd diva-api && php artisan serve`
4. Terminal 2: `cd frontend && npm run dev`, lalu buka port 5173.

(Database default Laravel 11 adalah SQLite, jadi tidak perlu MySQL untuk mencoba.)

## Menjalankan manual (butuh PHP 8.2+, Composer, Node 18+, MySQL)

### 1. Backend
```bash
composer create-project laravel/laravel diva-api
cd diva-api
php artisan install:api                 # memasang Laravel Sanctum + routes/api.php

# salin isi folder backend/ dari proyek ini ke dalam diva-api/ (timpa file yang sama:
# routes/api.php, app/Models/User.php, database/seeders/DatabaseSeeder.php)

# .env  ->  DB_CONNECTION=mysql, DB_DATABASE=diva_florist, DB_USERNAME=..., DB_PASSWORD=...
#           FRONTEND_URL=http://localhost:5173
php artisan migrate --seed
php artisan serve                       # http://127.0.0.1:8000
```
Admin awal: `admin@divaflorist.test` / `password123` (ganti segera).

### 2. Frontend
```bash
cd frontend
npm install
npm run dev                             # http://localhost:5173
```
Saat dev, Vite meneruskan `/api` ke Laravel (port 8000). Untuk deploy, isi `VITE_API_URL`.

## Endpoint API
| Method | URL | Fungsi |
|---|---|---|
| GET | /api/products | Daftar produk aktif |
| POST | /api/orders | Buat pesanan (harga dihitung server) |
| GET | /api/orders/{no} | Lacak status pesanan |
| POST | /api/admin/login | Login admin → token |
| GET/PATCH | /api/admin/orders | Lihat / ubah status pesanan |
| GET/PUT | /api/admin/products | Lihat / ubah harga & aktif produk |

## Halaman
`/` beranda · `/katalog` · `/produk/:slug` · `/keranjang` · `/checkout` · `/pesanan/:no` · `/lacak` · `/cara-pesan` · `/admin`
