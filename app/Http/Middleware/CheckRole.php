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
        
        // Liste des routes accessibles à tous les utilisateurs authentifiés
        $publicAuthRoutes = [
            'checkout',
            'cart*',
            'orders*',
            'products/*/like',
            'user/liked-products',
            'api/cart*',
            'profile',
            'profile/*',
            'dashboard',
            'blog/*/comment',
            'contact/send-message' // Ajouté pour le formulaire de contact
        ];
        
        // Vérifier si la route actuelle correspond aux routes publiques
        foreach ($publicAuthRoutes as $pattern) {
            if ($request->is($pattern)) {
                return $next($request);
            }
        }
        
        // Routes admin accessibles seulement aux rôles autorisés
        $adminRoutes = [
            'admin*',  // Toutes les routes admin
            'products*', // Gestion des produits
            'categories*', // Gestion des catégories
            'orders/manage*', // Gestion des commandes
            'users*', // Gestion des utilisateurs
            'blog/manage*', // Gestion du blog
            'contact/admin*' // Gestion des contacts admin
        ];
        
        $adminRoles = ['admin', 'webmaster', 'cm', 'agent'];
        
        // Vérifier si c'est une route admin
        foreach ($adminRoutes as $pattern) {
            if ($request->is($pattern)) {
                if (!$user->role || !in_array($user->role->name, $adminRoles)) {
                    abort(403, 'Access denied. Admin permissions required.');
                }
                return $next($request);
            }
        }
        
        // Pour les autres routes, vérifier le rôle demandé
        if (!$user->role || !in_array($user->role->name, $roles)) {
            abort(403, 'Access denied. Insufficient permissions.');
        }

        return $next($request);
    }
}