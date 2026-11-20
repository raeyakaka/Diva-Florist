#!/usr/bin/env bash
# Membuat proyek Laravel (diva-api/) lalu memasang kode dari folder backend/
set -e
composer create-project laravel/laravel diva-api --no-interaction
cd diva-api
php artisan install:api --no-interaction || true
cp -r ../backend/. .
php artisan migrate --seed --force
echo "Backend siap. Jalankan: cd diva-api && php artisan serve"
