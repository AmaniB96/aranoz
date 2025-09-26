<?php

namespace Database\Seeders;

use App\Models\CartProduct;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CartProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $carts = Cart::all();
        $products = Product::all();

        foreach ($carts as $cart) {
            CartProduct::create([
                'cart_id' => $cart->id,
                'product_id' => $products->random()->id,
                'quantity' => rand(1, 5),
            ]);

            if (rand(0, 1)) {
                CartProduct::create([
                    'cart_id' => $cart->id,
                    'product_id' => $products->random()->id,
                    'quantity' => rand(1, 3),
                ]);
            }
        }
    }
}