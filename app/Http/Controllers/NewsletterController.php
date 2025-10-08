<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\NewsletterSubscription;
use Illuminate\Support\Facades\Log;

class NewsletterController extends Controller
{
    public function signup(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        try {
            // Récupérer tous les produits en promotion
            $discountedProducts = Product::whereHas('promo', function($query) {
                $query->where('active', true);
            })->with('promo')->get();

            $placeholderPath = public_path('images/placeholder.png');

            $products = $discountedProducts->map(function ($product) use ($placeholderPath) {
                $imagePath = null;

                if (!empty($product->image_front)) {
                    $candidate = storage_path("app/public/products/card/{$product->image_front}");
                    if (file_exists($candidate)) {
                        $imagePath = $candidate;
                    }
                }

                if (!$imagePath && file_exists($placeholderPath)) {
                    $imagePath = $placeholderPath;
                }

                // LOG POUR DÉBOGUER
                Log::info('Newsletter product image', [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'image_front' => $product->image_front,
                    'candidate_path' => $candidate ?? 'none',
                    'final_path' => $imagePath,
                    'exists' => $imagePath ? file_exists($imagePath) : false,
                    'size' => $imagePath ? filesize($imagePath) : 0,
                ]);

                $discountedPrice = $product->price * (1 - $product->promo->discount / 100);
                $savings = $product->price - $discountedPrice;

                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'original_price' => number_format($product->price, 2),
                    'discount_percent' => $product->promo->discount,
                    'discounted_price' => number_format($discountedPrice, 2),
                    'savings' => number_format($savings, 2),
                    'image_path' => $imagePath,
                ];
            })->values()->toArray();

            Log::info('Sending newsletter with ' . count($products) . ' products');

            Mail::to($request->email)->send(new NewsletterSubscription($products));

            return response()->json([
                'success' => true,
                'message' => 'Newsletter subscription successful! Check your email for discounted products.',
                'products_count' => count($products),
            ]);

        } catch (\Exception $e) {
            Log::error('Newsletter subscription failed: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'email' => $request->email,
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to send newsletter. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}