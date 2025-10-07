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
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('discount_percentage', 5, 2)->nullable(); // Pourcentage de réduction
            $table->decimal('discount_amount', 10, 2)->nullable(); // Montant fixe de réduction
            $table->decimal('min_purchase_amount', 10, 2)->nullable(); // Montant minimum d'achat
            $table->integer('usage_limit')->nullable(); // Nombre maximum d'utilisations
            $table->integer('usage_count')->default(0); // Nombre d'utilisations actuelles
            $table->date('expires_at')->nullable(); // Date d'expiration
            $table->boolean('is_active')->default(true); // Coupon actif ou non
            $table->json('applicable_products')->nullable(); // Produits spécifiques (optionnel)
            $table->json('applicable_categories')->nullable(); // Catégories spécifiques (optionnel)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coupons');
    }
};
