<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();
        
         if ($request->is('checkout') || 
            $request->is('cart*') || 
            $request->is('orders*') ||
            $request->is('products/*/like') ||
            $request->is('user/liked-products') ||
            $request->is('api/cart*')) {
            return $next($request);
        }
        
        // Pour les autres routes, vérifier le rôle
        if (!$user->role || !in_array($user->role->name, $roles)) {
            abort(403, 'Access denied. Insufficient permissions.');
        }

        return $next($request);
    }
}