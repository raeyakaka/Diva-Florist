<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['slug', 'name', 'category', 'description', 'image', 'alt', 'prices', 'is_active'];

    protected $casts = ['prices' => 'array', 'is_active' => 'boolean'];
}
