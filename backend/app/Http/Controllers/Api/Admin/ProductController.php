<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json(['data' => Product::orderBy('id')->get()]);
    }

    public function update(Request $r, Product $product)
    {
        $d = $r->validate([
            'name' => 'sometimes|string|max:150',
            'description' => 'sometimes|string',
            'prices' => 'sometimes|array',
            'prices.S' => 'required_with:prices|integer|min:0',
            'prices.M' => 'required_with:prices|integer|min:0',
            'prices.L' => 'required_with:prices|integer|min:0',
            'is_active' => 'sometimes|boolean',
        ]);
        $product->update($d);

        return response()->json($product);
    }
}
