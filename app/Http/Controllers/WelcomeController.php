<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB; // AJOUT

class WelcomeController extends Controller
{
    public function index()
    {
        // Carrousel: 4 produits aléatoires + produits épinglés
        $pinnedProducts = Product::where('isPinned', true)->get();
        $randomProducts = Product::whereNotIn('id', $pinnedProducts->pluck('id'))
                                ->inRandomOrder()
                                ->take(4 - $pinnedProducts->count())
                                ->get();
        $carouselProducts = $pinnedProducts->merge($randomProducts);

        // Categories (4 principales)
        $categories = ProductCategory::take(4)->get();

        // Section Awesome: tous les produits
        $products = Product::all();

        // Weekly Sale: produit avec promo active
        $weeklyProduct = Product::whereHas('promo', function($query) {
            $query->where('active', true);
        })->with('promo')->inRandomOrder()->first();

        // Ajouter le prix réduit calculé
        if ($weeklyProduct && $weeklyProduct->promo) {
            $weeklyProduct->discounted_price = $weeklyProduct->price - ($weeklyProduct->price * $weeklyProduct->promo->discount / 100);
        }

        // CORRECTION: Best Sellers basé sur les ventes réelles via CartProduct
        $bestSellers = Product::select('products.*', DB::raw('COUNT(cart_products.id) as sales_count'))
                             ->join('cart_products', 'products.id', '=', 'cart_products.product_id')
                             ->join('carts', 'cart_products.cart_id', '=', 'carts.id')
                             ->join('orders', 'carts.id', '=', 'orders.cart_id') // Uniquement les carts convertis en orders
                             ->groupBy('products.id')
                             ->orderBy('sales_count', 'desc')
                             ->take(4)
                             ->get();

        // Si pas de ventes réelles, fallback sur stock bas (simulation)
        if ($bestSellers->isEmpty()) {
            $bestSellers = Product::orderBy('stock', 'asc')->take(4)->get();
        }

        // Produits en promotion pour newsletter
        $discountedProducts = Product::whereHas('promo', function($query) {
            $query->where('active', true);
        })->with('promo')->get();

        // Calculer les prix réduits
        $discountedProducts->each(function($product) {
            if ($product->promo) {
                $product->discounted_price = $product->price - ($product->price * $product->promo->discount / 100);
            }
        });

        return Inertia::render('Welcome', [
            'carouselProducts' => $carouselProducts,
            'categories' => $categories,
            'products' => $products,
            'weeklyProduct' => $weeklyProduct,
            'bestSellers' => $bestSellers,
            'discountedProducts' => $discountedProducts,
        ]);
    }
}