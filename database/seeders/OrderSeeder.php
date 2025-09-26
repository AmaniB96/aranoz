<?php

namespace Database\Seeders;

use App\Models\Order;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer 3 commandes d'exemple
        Order::create([
            'date' => Carbon::now()->subDays(5), // Commande il y a 5 jours
            'status' => 'confirmed',
            'cart_id' => 1, // Assumer que le cart avec ID 1 existe
        ]);

        Order::create([
            'date' => Carbon::now()->subDays(2), // Commande il y a 2 jours
            'status' => 'pending',
            'cart_id' => 2, // Assumer que le cart avec ID 2 existe
        ]);

        Order::create([
            'date' => Carbon::now()->subHours(6), // Commande il y a 6 heures
            'status' => 'confirmed',
            'cart_id' => null, // Commande sans panier associé
        ]);
    }
}