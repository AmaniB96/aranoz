<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShopProductController extends Controller
{
    public function show($id, Request $request)
    {
        $product = Product::with(['promo','productDetail','productCategory'])->findOrFail($id);

        $image_url = $product->image_front ? "/storage/products/card/{$product->image_front}" : '/storage/products/default.png';

        $gallery = [];
        foreach (['image_front','image_left','image_right','image_bonus'] as $imgField) {
            if (!empty($product->{$imgField})) {
                $gallery[] = "/storage/products/card/{$product->{$imgField}}";
            }
        }

        $discounted_price = null;
        $discount_percent = null;
        if ($product->promo && ($product->promo->active ?? false) && isset($product->promo->discount)) {
            $discount_percent = $product->promo->discount;
            $discounted_price = round($product->price - ($product->price * $discount_percent / 100), 2);
        }

        // convert model to array and inject computed fields
        $productArray = $product->toArray();
        $productArray['image_url'] = $image_url;
        $productArray['gallery'] = $gallery;
        $productArray['discounted_price'] = $discounted_price;
        $productArray['discount_percent'] = $discount_percent;

        // Ensure productDetail is available as camelCase for the frontend (product.productDetail)
        $productArray['productDetail'] = $product->productDetail ? $product->productDetail->toArray() : null;

        // Optionally expose productCategory as camelCase too
        $productArray['productCategory'] = $product->productCategory ? $product->productCategory->toArray() : null;

        return Inertia::render('Products/Show', [
            'product' => $productArray,
        ]);
    }
}