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
            $table->foreignId('user_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('order_number')->nullable()->unique();
        });
        
        // Generate order numbers for existing orders and assign to first user
        \DB::statement('UPDATE orders SET user_id = (SELECT id FROM users LIMIT 1) WHERE user_id IS NULL');
        \DB::statement('UPDATE orders SET order_number = CONCAT("ORD-", LPAD(id, 8, "0")) WHERE order_number IS NULL');
        
        // Make columns not nullable after data migration
        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable(false)->change();
            $table->string('order_number')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn(['user_id', 'order_number']);
        });
    }
};
