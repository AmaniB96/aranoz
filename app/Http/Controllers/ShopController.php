<?php

namespace App\Http\Controllers;

use App\Models\Color;
use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ShopController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
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
        $products->getCollection()->transform(function ($product) use ($user) {
            $product->discounted_price = null;
            if ($product->promo && $product->promo->active && isset($product->promo->discount)) {
                $product->discounted_price = round($product->price - ($product->price * $product->promo->discount / 100), 2);
                $product->discount_percent = $product->promo->discount;
            }
            // ensure image path is present
            $product->image_url = $product->image_front ? "/storage/products/card/{$product->image_front}" : '/storage/products/default.png';
            
            // Add liked status for current user
            $product->is_liked_by_user = $user ? $product->likedByUsers()->where('user_id', $user->id)->exists() : false;
            $product->liked_by_users_count = $product->likedByUsers()->count();
            
            return $product;
        });

        // Récupérer les best sellers (produits les plus populaires ou épinglés)
        $bestSellers = Product::with(['promo'])
            ->where('available', true)
            ->orderBy('isPinned', 'desc')
            ->orderBy('created_at', 'desc')
            ->take(4)
            ->get()
            ->map(function ($product) use ($user) {
                $data = [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'image_front' => $product->image_front,
                    'image_url' => $product->image_front ? "/storage/products/card/{$product->image_front}" : '/storage/products/default.png',
                    'promo_price' => $product->promo ? $product->promo->discount_amount : null,
                    'promo_percentage' => $product->promo ? $product->promo->discount_percentage : null,
                    'is_liked_by_user' => $user ? $product->likedByUsers()->where('user_id', $user->id)->exists() : false,
                    'liked_by_users_count' => $product->likedByUsers()->count(),
                ];
                
                // Add promo object for consistency
                if ($product->promo) {
                    $data['promo'] = $product->promo;
                }
                
                return $data;
            });

        $categories = ProductCategory::select('id','name')->get();
        $colors = Color::select('id','name')->get();

        return Inertia::render('Shop/Shop', [
            'products' => $products,
            'categories' => $categories,
            'colors' => $colors,
            'filters' => $request->only(['category','color','search','min_price','max_price','sort']),
            'bestSellers' => $bestSellers
        ]);
    }
}