<?php

namespace Database\Seeders;

use App\Models\Adress;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adresses = [
            [
                'user_id' => 1,
                'street' => '123 Rue de la Paix',
                'number' => 123,
                'city' => 'Paris',
                'state' => 'Île-de-France',
                'zip' => 75001,
                'country' => 'France',
            ],
            [
                'user_id' => 2,
                'street' => '456 Avenue des Champs',
                'number' => 456,
                'city' => 'Lyon',
                'state' => 'Auvergne-Rhône-Alpes',
                'zip' => 69000,
                'country' => 'France',
            ],
            [
                'user_id' => 3,
                'street' => '789 Boulevard Saint-Michel',
                'number' => 789,
                'city' => 'Marseille',
                'state' => 'Provence-Alpes-Côte d\'Azur',
                'zip' => 13000,
                'country' => 'France',
            ],
            [
                'user_id' => 4,
                'street' => '1010 Rue de la République',
                'number' => 1010,
                'city' => 'Toulouse',
                'state' => 'Occitanie',
                'zip' => 31000,
                'country' => 'France',
            ],
            [
                'user_id' => 5,
                'street' => '1111 Place Bellecour',
                'number' => 1111,
                'city' => 'Lyon',
                'state' => 'Auvergne-Rhône-Alpes',
                'zip' => 69002,
                'country' => 'France',
            ],
        ];

        foreach ($adresses as $adress) {
            Adress::create($adress);
        }
    }
}
