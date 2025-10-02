<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = Auth::user();
        
        // Debug: Check if user has liked products
        $likedProductsCount = $user->likedProducts()->count();
        
        $likedProducts = $user->likedProducts()
            ->with(['productCategory', 'color', 'promo'])
            ->get()
            ->map(function ($product) use ($user) {
                // $product est déjà un Product, pas un LikedProduct !
                
                // Skip if product doesn't exist (was deleted)
                if (!$product) {
                    return null;
                }
                
                $product->discounted_price = null;
                if ($product->promo && $product->promo->active && isset($product->promo->discount)) {
                    $product->discounted_price = round($product->price - ($product->price * $product->promo->discount / 100), 2);
                    $product->discount_percent = $product->promo->discount;
                }
                $product->image_url = $product->image_front ? "/storage/products/card/{$product->image_front}" : '/storage/products/default.png';
                
                // Add liked status (should be true since it comes from liked products)
                $product->is_liked_by_user = true;
                $product->liked_by_users_count = $product->likedByUsers()->count();
                
                return $product;
            })
            ->filter() // Remove null values
            ->values(); // Reindex array

        // Debug logs
        \Log::info('User liked products count: ' . $likedProductsCount);
        \Log::info('Liked products array count: ' . $likedProducts->count());

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail && !$request->user()->hasVerifiedEmail(),
            'status' => session('status'),
            'likedProducts' => $likedProducts,
            'debug' => [
                'likedProductsCount' => $likedProductsCount,
                'processedCount' => $likedProducts->count()
            ]
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
