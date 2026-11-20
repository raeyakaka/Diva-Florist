<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $t) {
            $t->id();
            $t->string('order_number')->unique();
            $t->string('sender_name');
            $t->string('sender_phone', 20);
            $t->string('receiver_name');
            $t->string('receiver_phone', 20);
            $t->text('address');
            $t->date('delivery_date');
            $t->string('delivery_slot');
            $t->unsignedBigInteger('total');
            $t->string('status')->default('pending'); // pending|processing|shipped|done|cancelled
            $t->timestamps();
        });

        Schema::create('order_items', function (Blueprint $t) {
            $t->id();
            $t->foreignId('order_id')->constrained()->cascadeOnDelete();
            $t->foreignId('product_id')->constrained();
            $t->string('product_name'); // salinan nama & harga saat dipesan
            $t->string('size', 1);
            $t->unsignedBigInteger('price');
            $t->unsignedSmallInteger('qty');
            $t->string('card_message', 120)->nullable();
            $t->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};
