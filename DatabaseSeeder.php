<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin awal: GANTI password ini sebelum dipakai sungguhan
        User::updateOrCreate(['email' => 'admin@divaflorist.test'], ['name' => 'Admin Diva', 'password' => 'password123']);

        // Harga masih CONTOH, ubah lewat dashboard admin
        $items = [
            ['p1', 'Buket Mawar Satin Merah', 'Buket Bunga', 'Buket mawar satin merah dengan satu mawar merah muda di tengah',
                'Rangkaian mawar satin merah dengan satu mawar merah muda di tengah dan sentuhan baby’s breath, dibungkus kertas abu-abu dan mesh merah muda dengan pita merah.', [150000, 250000, 400000]],
            ['p2', 'Buket Uang Biru', 'Buket Uang', 'Buket uang dengan pembungkus biru muda dan pita emas',
                'Contoh buket uang dengan lembaran Rp100.000 yang ditata menyebar, pembungkus biru muda, dan pita emas.', [200000, 350000, 600000]],
            ['p3', 'Buket Uang Putih', 'Buket Uang', 'Buket uang dengan pembungkus putih bermotif hati dan pita ungu',
                'Contoh buket uang dengan lembaran Rp10.000, pembungkus putih bermotif hati, pita ungu, dan bunga kuning di bagian bawah.', [180000, 300000, 500000]],
        ];

        foreach ($items as [$id, $name, $cat, $alt, $desc, $pr]) {
            Product::updateOrCreate(['slug' => $id], [
                'name' => $name, 'category' => $cat, 'description' => $desc, 'alt' => $alt,
                'image' => "/img/$id.jpg", 'prices' => ['S' => $pr[0], 'M' => $pr[1], 'L' => $pr[2]], 'is_active' => true,
            ]);
        }
    }
}
