<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShopProductController extends Controller
{
    public function show($id) {
        $product = Product::with(['productCategory', 'color', 'promo', 'productDetail'])
            ->findOrFail($id);

        // Ajouter les URLs des images
        $product->image_url = $product->image_front ? "/storage/products/show/{$product->image_front}" : null;
        $product->gallery = array_filter([
            $product->image_front ? "/storage/products/show/{$product->image_front}" : null,
            $product->image_left ? "/storage/products/show/{$product->image_left}" : null,
            $product->image_right ? "/storage/products/show/{$product->image_right}" : null,
            $product->image_bonus ? "/storage/products/show/{$product->image_bonus}" : null,
        ]);

        // Récupérer les best sellers (produits les plus populaires ou épinglés)
        $bestSellers = Product::with(['promo'])
            ->where('available', true)
            ->where('id', '!=', $id) // Exclure le produit actuel
            ->orderBy('isPinned', 'desc')
            ->orderBy('created_at', 'desc')
            ->take(4)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'image_front' => $product->image_front,
                    'promo_price' => $product->promo ? $product->promo->discount_amount : null,
                    'promo_percentage' => $product->promo ? $product->promo->discount_percentage : null,
                ];
            });

        return Inertia::render('Products/Show', [
            'product' => $product,
            'bestSellers' => $bestSellers
        ]);
    }
}