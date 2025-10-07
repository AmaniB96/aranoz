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
        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('coupon_id')->nullable()->constrained('coupons')->nullOnDelete();
            $table->decimal('subtotal', 10, 2)->default(0); // Montant avant coupon
            $table->decimal('discount_amount', 10, 2)->default(0); // Montant de la réduction
            $table->decimal('total', 10, 2)->default(0); // Montant final payé
            $table->string('coupon_code')->nullable(); // Code du coupon appliqué
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['coupon_id']);
            $table->dropColumn(['coupon_id', 'subtotal', 'discount_amount', 'total', 'coupon_code']);
        });
    }
};
