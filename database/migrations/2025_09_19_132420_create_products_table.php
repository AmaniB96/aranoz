<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('price');
            $table->string('description');
            $table->foreignId('product_category_id')->constrained('product_categories')->nullOnDelete();
            $table->integer('stock');
            $table->string('image_front');
            $table->string('image_left');
            $table->string('image_right');
            $table->string('image_bonus');
            $table->boolean('isPinned');
            $table->foreignId('promo_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
