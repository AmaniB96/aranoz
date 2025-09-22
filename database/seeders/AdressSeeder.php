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
                'first_name' => 'Admin',
                'last_name' => 'User',
                'company_name' => 'Aranoz',
                'address' => '123 Rue de la Paix',
                'city' => 'Paris',
                'district' => 'Île-de-France',
                'postcode' => '75001',
                'phone' => '01 23 45 67 89',
                'email' => 'admin@example.com',
            ],
            [
                'user_id' => 2,
                'first_name' => 'Modo',
                'last_name' => 'User',
                'company_name' => null,
                'address' => '456 Avenue des Champs',
                'city' => 'Lyon',
                'district' => 'Auvergne-Rhône-Alpes',
                'postcode' => '69000',
                'phone' => '04 56 78 90 12',
                'email' => 'modo@example.com',
            ],
            [
                'user_id' => 3,
                'first_name' => 'Regular',
                'last_name' => 'User',
                'company_name' => null,
                'address' => '789 Boulevard Saint-Michel',
                'city' => 'Marseille',
                'district' => 'Provence-Alpes-Côte d\'Azur',
                'postcode' => '13000',
                'phone' => '04 91 23 45 67',
                'email' => 'user@example.com',
            ],
            [
                'user_id' => 4,
                'first_name' => 'Webmaster',
                'last_name' => 'User',
                'company_name' => 'Tech Solutions',
                'address' => '1010 Rue de la République',
                'city' => 'Toulouse',
                'district' => 'Occitanie',
                'postcode' => '31000',
                'phone' => '05 61 23 45 67',
                'email' => 'webmaster@example.com',
            ],
            [
                'user_id' => 5,
                'first_name' => 'CM',
                'last_name' => 'User',
                'company_name' => null,
                'address' => '1111 Place Bellecour',
                'city' => 'Lyon',
                'district' => 'Auvergne-Rhône-Alpes',
                'postcode' => '69002',
                'phone' => '04 72 34 56 78',
                'email' => 'cm@example.com',
            ],
        ];

        foreach ($adresses as $adress) {
            Adress::create($adress);
        }
    }
}
