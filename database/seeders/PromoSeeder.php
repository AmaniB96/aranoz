<?php

namespace Database\Seeders;

use App\Models\Promo;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PromoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Promo::create([
            'name' => 'Promo de fou',
            'discount' => 20.00,
            'active' => true,
        ]);

        Promo::create([
            'name' => 'Soldes été',
            'discount' => 15.00,
            'active' => true,
        ]);

        Promo::create([
            'name' => 'Clearance',
            'discount' => 30.00,
            'active' => true,
        ]);

        Promo::create([
            'name' => 'Promo inactive',
            'discount' => 10.00,
            'active' => false, // Pour tester les promos inactives
        ]);
    }
}
