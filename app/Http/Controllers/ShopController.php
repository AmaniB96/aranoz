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
        
        // Récupérer les produits disponibles
        $query = Product::query()->with('promo')->where('available', true);

        // AJOUTER LES RELATIONS DE LIKES
        $query->with(['likedByUsers' => function($q) use ($user) {
            if ($user) {
                $q->where('user_id', $user->id);
            }
        }])->withCount('likedByUsers');

        // Filtrer par catégorie
        if ($request->category) {
            $query->where('product_category_id', $request->category);
        }

        // Filtrer par couleur
        if ($request->color) {
            $query->where('color_id', $request->color);
        }

        // Filtrer par recherche
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('description', 'like', "%{$request->search}%");
            });
        }

        // Filtrer par fourchette de prix
        if ($request->min_price) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->max_price) {
            $query->where('price', '<=', $request->max_price);
        }

        // Trier
        $sortBy = $request->sort_by ?? 'created_at';
        $sortOrder = $request->sort_order ?? 'desc';
        $query->orderBy($sortBy, $sortOrder);

        // Paginer
        $products = $query->paginate(9);

        // Transformer pour ajouter les URLs d'images
        $products->getCollection()->transform(function ($product) use ($user) {
            // SIMPLE : Juste construire l'URL si image_front existe
            $imageUrl = $product->image_front 
                ? "/storage/products/card/{$product->image_front}"
                : null;
            
            $data = [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => $product->price,
                'image_front' => $product->image_front,
                'image_url' => $imageUrl,
                'promo' => null,
            ];

            if ($product->promo && $product->promo->active) {
                $data['promo'] = [
                    'id' => $product->promo->id,
                    'name' => $product->promo->name,
                    'discount' => $product->promo->discount,
                    'active' => $product->promo->active,
                ];
            }

            $data['isFavorited'] = false;
            if ($user && method_exists($user, 'favorites')) {
                $data['isFavorited'] = $user->favorites()->where('product_id', $product->id)->exists();
            }

            // AJOUTER LES DONNÉES DE LIKES AU TABLEAU RETOURNÉ
            $data['is_liked_by_user'] = $user ? $product->likedByUsers->isNotEmpty() : false;
            $data['liked_by_users_count'] = $product->liked_by_users_count;

            return $data;
        });

        // Best sellers
        $bestSellers = Product::with(['promo'])
            ->where('available', true)
            ->orderBy('isPinned', 'desc')
            ->orderBy('created_at', 'desc')
            ->take(4)
            ->get()
            ->map(function ($product) use ($user) {
                // SIMPLE : Juste construire l'URL
                $imageUrl = $product->image_front 
                    ? "/storage/products/card/{$product->image_front}"
                    : null;
                
                $data = [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'image_front' => $product->image_front,
                    'image_url' => $imageUrl,
                    'promo' => $product->promo && $product->promo->active ? [
                        'id' => $product->promo->id,
                        'name' => $product->promo->name,
                        'discount' => $product->promo->discount,
                        'active' => $product->promo->active,
                    ] : null,
                ];
                
                $data['isFavorited'] = false;
                if ($user && method_exists($user, 'favorites')) {
                    $data['isFavorited'] = $user->favorites()->where('product_id', $product->id)->exists();
                }
                
                return $data;
            });

        // Récupérer les catégories et couleurs pour les filtres
        $categories = ProductCategory::all();
        $colors = Color::all();

        return Inertia::render('Shop/Shop', [
            'products' => $products,
            'categories' => $categories,
            'colors' => $colors,
            'filters' => $request->only(['category', 'color', 'search', 'min_price', 'max_price', 'sort_by', 'sort_order']),
            'bestSellers' => $bestSellers,
        ]);
    }
}