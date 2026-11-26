<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('products', function (Blueprint $t) {
            $t->id();
            $t->string('slug')->unique();
            $t->string('name');
            $t->string('category');
            $t->text('description');
            $t->string('image');
            $t->string('alt');
            $t->json('prices'); // {"S":150000,"M":250000,"L":400000}
            $t->boolean('is_active')->default(true);
            $t->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('products'); }
};
