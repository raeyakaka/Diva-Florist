<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function store(StoreOrderRequest $request)
    {
        $d = $request->validated();

        $order = DB::transaction(function () use ($d) {
            $total = 0;
            $rows = [];
            foreach ($d['items'] as $i) {
                // Harga SELALU diambil dari database, bukan dari browser (anti-manipulasi)
                $p = Product::where('slug', $i['slug'])->where('is_active', true)->firstOrFail();
                $price = $p->prices[$i['size']];
                $total += $price * $i['qty'];
                $rows[] = [
                    'product_id' => $p->id, 'product_name' => $p->name, 'size' => $i['size'],
                    'price' => $price, 'qty' => $i['qty'], 'card_message' => $i['message'] ?? null,
                ];
            }

            $order = Order::create([
                'order_number' => 'DF-' . strtoupper(Str::random(6)),
                'sender_name' => $d['sender_name'], 'sender_phone' => $d['sender_phone'],
                'receiver_name' => $d['receiver_name'], 'receiver_phone' => $d['receiver_phone'],
                'address' => $d['address'], 'delivery_date' => $d['delivery_date'],
                'delivery_slot' => $d['delivery_slot'], 'total' => $total, 'status' => 'pending',
            ]);
            $order->items()->createMany($rows);

            return $order;
        });

        return response()->json($order->load('items'), 201);
    }

    // Lacak pesanan lewat nomor pesanan (hanya data yang aman ditampilkan)
    public function show(string $number)
    {
        $o = Order::with('items')->where('order_number', $number)->firstOrFail();

        return response()->json($o->only([
            'order_number', 'sender_name', 'receiver_name', 'delivery_date', 'delivery_slot', 'status', 'total',
        ]) + ['items' => $o->items]);
    }
}
