<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json(['data' => Product::where('is_active', true)->orderBy('id')->get()]);
    }

    public function show(string $slug)
    {
        return response()->json(Product::where('slug', $slug)->where('is_active', true)->firstOrFail());
    }
}
