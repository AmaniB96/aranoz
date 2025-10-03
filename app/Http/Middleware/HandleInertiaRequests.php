<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Cart;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        
        // Charger l'utilisateur avec sa relation role
        if ($user) {
            $user->load('role');
        }
        
        $cartCount = 0;
        
        if ($user) {
            // Calculer le cartCount seulement pour les paniers actifs (non commandés)
            $activeCart = Cart::where('user_id', $user->id)
                ->whereNull('ordered_at')
                ->first();
            
            if ($activeCart) {
                $cartCount = $activeCart->cartProducts()->sum('quantity');
            }
        }
        
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            'cartCount' => (int) $cartCount,
        ];
    }
}
