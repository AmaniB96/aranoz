<?php

namespace Database\Seeders;

use App\Models\ProductCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ProductCategory::insert([
            ['nom' => 'Chaises'],
            ['nom' => 'Buffets'],
            ['nom' => 'Vaisseliers'],
            ['nom' => 'Étagères'],
            ['nom' => 'Bibliothèques'],
            ['nom' => 'Canapés'],
            ['nom' => 'Fauteuils'],
            ['nom' => 'Méridiennes'],
            ['nom' => 'Bureaux'],
            ['nom' => 'Lits'],
            ['nom' => 'Armoires'],
        ]);
    }
}
