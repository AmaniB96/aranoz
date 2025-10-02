<?php

namespace App\Http\Controllers;

use App\Models\LikedProduct;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LikedProductController extends Controller
{
    // Toggle like/unlike
    public function toggle(Request $request, $productId)
    {
        $user = Auth::user();
        if (!$user) {
            return redirect()->back()->with('error', 'You must be logged in to like products');
        }

        $product = Product::findOrFail($productId);
        
        // Utiliser la clé primaire composite pour trouver le like
        $existingLike = LikedProduct::where('user_id', $user->id)
                                   ->where('product_id', $productId)
                                   ->first();

        if ($existingLike) {
            // Unlike - utiliser delete() directement sur la requête
            LikedProduct::where('user_id', $user->id)
                       ->where('product_id', $productId)
                       ->delete();
            $message = 'Product unliked successfully!';
        } else {
            // Like
            LikedProduct::create([
                'user_id' => $user->id,
                'product_id' => $productId
            ]);
            $message = 'Product liked successfully!';
        }

        return redirect()->back()->with('success', $message);
    }

    // Admin view of product likes
    public function adminIndex()
    {
        $products = Product::with(['productCategory', 'likedByUsers'])
            ->withCount('likedByUsers')
            ->orderBy('liked_by_users_count', 'desc')
            ->paginate(20);

        return Inertia::render('Admin/LikedProducts/Index', [
            'products' => $products
        ]);
    }
}