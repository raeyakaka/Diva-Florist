<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    public function index()
    {
        return response()->json(['data' => Order::with('items')->latest()->get()]);
    }

    public function update(Request $r, Order $order)
    {
        $d = $r->validate(['status' => ['required', Rule::in(Order::STATUSES)]]);
        $order->update($d);

        return response()->json($order->load('items'));
    }
}
