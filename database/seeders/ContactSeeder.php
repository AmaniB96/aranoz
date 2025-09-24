<?php

namespace Database\Seeders;

use App\Models\Contact;
use App\Models\ContactInfo;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ContactSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Contact::create([
            'street' => '12 rue de la Paix',
            'state' => 'Île-de-France',
            'city' => 'Paris',
            'country_code' => 'FRA',
            'zip_code' => '75002',
            'street_number' => '8',
            'email' => 'contact@aranoz.fr',
            'phone_number' => '+33 1 23 45 67 89',
        ]);
    }
}