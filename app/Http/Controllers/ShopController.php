<?php

namespace App\Http\Controllers;

use App\Models\Color;
use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShopController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query()->with('promo', 'productCategory');

        // Filters (server-side)
        if ($request->filled('category')) {
            $query->where('product_category_id', $request->category);
        }

        if ($request->filled('color')) {
            $query->where('color_id', $request->color);
        }

        if ($request->filled('search')) {
            $q = $request->search;
            $query->where(function ($qf) use ($q) {
                $qf->where('name', 'like', "%{$q}%")
                   ->orWhere('description', 'like', "%{$q}%");
            });
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', (float)$request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', (float)$request->max_price);
        }

        // Sorting
        if ($request->filled('sort')) {
            switch ($request->sort) {
                case 'price_asc':
                    $query->orderBy('price', 'asc');
                    break;
                case 'price_desc':
                    $query->orderBy('price', 'desc');
                    break;
                case 'newest':
                    $query->orderBy('created_at', 'desc');
                    break;
                default:
                    $query->orderBy('id', 'desc');
            }
        } else {
            $query->orderBy('id', 'desc');
        }

        // Pagination 9 per page
        $products = $query->paginate(9)->withQueryString();

        // Compute discounted_price attribute for frontend
        $products->getCollection()->transform(function ($product) {
            $product->discounted_price = null;
            if ($product->promo && $product->promo->active && isset($product->promo->discount)) {
                $product->discounted_price = round($product->price - ($product->price * $product->promo->discount / 100), 2);
                $product->discount_percent = $product->promo->discount;
            }
            // ensure image path is present
            $product->image_url = $product->image_front ? "/storage/products/card/{$product->image_front}" : '/storage/products/default.png';
            return $product;
        });

        $categories = ProductCategory::select('id','name')->get();
        // If ProductColor model differs, adjust name
        $colors = Color::select('id','name')->get();

        return Inertia::render('Shop/Shop', [
            'products' => $products,
            'categories' => $categories,
            'colors' => $colors,
            'filters' => $request->only(['category','color','search','min_price','max_price','sort']),
        ]);
    }
}