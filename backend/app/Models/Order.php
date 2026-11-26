<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    public const STATUSES = ['pending', 'processing', 'shipped', 'done', 'cancelled'];

    protected $fillable = [
        'order_number', 'sender_name', 'sender_phone', 'receiver_name', 'receiver_phone',
        'address', 'delivery_date', 'delivery_slot', 'total', 'status',
    ];

    public function items(): HasMany { return $this->hasMany(OrderItem::class); }
}
