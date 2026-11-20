<?php

use App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

// ===== Publik (pembeli) =====
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);
Route::post('/orders', [OrderController::class, 'store'])->middleware('throttle:10,1');
Route::get('/orders/{number}', [OrderController::class, 'show']);

// ===== Admin =====
Route::post('/admin/login', [Admin\AuthController::class, 'login'])->middleware('throttle:10,1');

Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::post('/logout', [Admin\AuthController::class, 'logout']);
    Route::get('/orders', [Admin\OrderController::class, 'index']);
    Route::patch('/orders/{order}', [Admin\OrderController::class, 'update']);
    Route::get('/products', [Admin\ProductController::class, 'index']);
    Route::put('/products/{product}', [Admin\ProductController::class, 'update']);
});
