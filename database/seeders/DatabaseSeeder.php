<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Appeler les seeders dans l'ordre des dépendances
        $this->call([
            CartSeeder::class,      // Paniers
            CartProductSeeder::class, // Produits dans paniers
            OrderSeeder::class,     // Commandes
        ]);
    }
}
