# Laporan Software Engineer – Pertemuan 10: Diva Florist

## 1. Tech Stack
| Bagian | Teknologi | Fungsi |
|---|---|---|
| Frontend | React 18, Vite, React Router, Axios | Tampilan, keranjang, form checkout, dashboard admin |
| Backend | Laravel 11, Sanctum | REST API, validasi, hitung harga, login admin |
| Database | MySQL | Tabel products, orders, order_items, users |
| Tools | Git/GitHub, Postman, VS Code | Versi kode, uji API, editor |

## 2. Arsitektur Sistem
```
Pembeli/Admin → React (browser)
   → Axios: HTTP request JSON (/api/...)
   → Laravel: routes/api.php → Controller → Model (Eloquent)
   → MySQL → respons JSON → React menampilkan data
```
Alur pesanan: keranjang disimpan di browser (localStorage) → `POST /api/orders` berisi slug, ukuran, jumlah → Laravel memvalidasi, **menghitung total dari harga di database**, menyimpan order + item dalam satu transaksi → mengembalikan nomor pesanan `DF-XXXXXX`.
Admin: login → token Sanctum (Bearer) → kelola status pesanan dan harga produk.

## 3. Progres Koding
| Fitur | Status |
|---|---|
| Katalog, pencarian, filter, detail produk | ✅ Selesai |
| Keranjang + kartu ucapan | ✅ Selesai |
| Checkout + validasi (client & server) | ✅ Selesai |
| API produk & pesanan, lacak pesanan | ✅ Kode selesai |
| Login admin, kelola pesanan & produk | ✅ Kode selesai |
| Pembayaran online | ⏳ Belum (tahap berikutnya) |
| Upload foto produk, notifikasi WhatsApp otomatis | ⏳ Belum |

Persentase: **isi setelah kalian menjalankan & mengetes sendiri** (contoh: 7 fitur dibuat, 5 sudah lolos tes → 71%).
Demo: tempel screenshot/rekaman layar: katalog, checkout, halaman lacak, dashboard admin, dan hasil Postman.

## 4. Kendala & Solusi
| Kendala | Solusi |
|---|---|
| Prototipe awal satu file HTML, data hardcode | Dipecah jadi komponen React + data dari API Laravel |
| CORS saat React memanggil Laravel | `config/cors.php` + proxy Vite saat development |
| Harga bisa dimanipulasi dari browser | Total selalu dihitung ulang di server dari database |
| Akses admin | Laravel Sanctum token + rate limit pada login |
| Pesanan gagal separuh jalan | `DB::transaction` agar order dan item tersimpan utuh |
