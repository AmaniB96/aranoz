<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class MainController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $role = $user->role->name;
        
        // Statistiques de base pour tous
        $stats = [
            'total_users' => \App\Models\User::count(),
        ];
        
        // Ajouter des stats selon le rôle
        if (in_array($role, ['admin', 'webmaster'])) {
            $stats['total_products'] = \App\Models\Product::count();
        }
        
        if (in_array($role, ['admin', 'agent'])) {
            $stats['total_orders'] = \App\Models\Order::count();
            $stats['unread_messages'] = \App\Models\Mail::where('archived', false)->count();
        }
        
        if (in_array($role, ['admin', 'cm'])) {
            $stats['total_blogs'] = \App\Models\Blog::count();
        }

        return Inertia::render('Admin/main/Main', [
            'stats' => $stats
        ]);
    }
}