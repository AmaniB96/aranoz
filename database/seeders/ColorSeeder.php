<?php

namespace Database\Seeders;

use App\Models\Color;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ColorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Color::insert([
            ['name' => 'Rouge', 'color_code' => '#FF0000'],
            ['name' => 'Bleu', 'color_code' => '#0000FF'],
            ['name' => 'Vert', 'color_code' => '#00FF00'],
            ['name' => 'Jaune', 'color_code' => '#FFFF00'],
            ['name' => 'Noir', 'color_code' => '#000000'],
            ['name' => 'Blanc', 'color_code' => '#FFFFFF'],
            ['name' => 'Gris', 'color_code' => '#808080'],
            ['name' => 'Marron', 'color_code' => '#8B4513'],
        ]);
    }
}
