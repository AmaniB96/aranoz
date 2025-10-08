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
            if ($request->wantsJson()) {
                return response()->json(['error' => 'You must be logged in to like products'], 401);
            }
            return redirect()->back()->with('error', 'You must be logged in to like products');
        }

        $product = Product::findOrFail($productId);
        
        $existingLike = LikedProduct::where('user_id', $user->id)
                                   ->where('product_id', $productId)
                                   ->first();

        if ($existingLike) {
            // UTILISER UNE REQUÊTE DELETE DIRECTE AU LIEU DE $existingLike->delete()
            LikedProduct::where('user_id', $user->id)
                       ->where('product_id', $productId)
                       ->delete();
            $liked = false;
            $message = 'Product unliked successfully!';
        } else {
            LikedProduct::create([
                'user_id' => $user->id,
                'product_id' => $productId
            ]);
            $liked = true;
            $message = 'Product liked successfully!';
        }

        // RETOURNER DU JSON POUR AJAX
        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => $message,
                'liked' => $liked,
                'likesCount' => $product->fresh()->liked_by_users_count
            ]);
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