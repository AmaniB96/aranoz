<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use App\Models\Cart;
use Illuminate\Support\Facades\Auth;
use App\Services\ImageService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(ImageService::class, function ($app) {
            return new ImageService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // expose cartCount to Inertia pages
        Inertia::share('cartCount', function () {
            $user = Auth::user();
            if (! $user) {
                return 0;
            }
            $cart = Cart::where('user_id', $user->id)->first();
            if (! $cart) {
                return 0;
            }
            // sum quantities in cartProducts
            return $cart->cartProducts()->sum('quantity') ?? 0;
        });
    }
}
