<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Admin User',
                'first_name' => 'Admin',
                'pseudo' => 'admin',
                'email' => 'admin@example.com',
                'password' => Hash::make('password'),
                'role_id' => 1, 
            ],
            [
                'name' => 'Modo User',
                'first_name' => 'Modo',
                'pseudo' => 'modo',
                'email' => 'modo@example.com',
                'password' => Hash::make('password'),
                'role_id' => 2, 
            ],
            [
                'name' => 'Regular User',
                'first_name' => 'User',
                'pseudo' => 'user',
                'email' => 'user@example.com',
                'password' => Hash::make('password'),
                'role_id' => 3, 
            ],
            [
                'name' => 'Webmaster User',
                'first_name' => 'Webmaster',
                'pseudo' => 'webmaster',
                'email' => 'webmaster@example.com',
                'password' => Hash::make('password'),
                'role_id' => 4,
            ],
            [
                'name' => 'CM User',
                'first_name' => 'CM',
                'pseudo' => 'cm',
                'email' => 'cm@example.com',
                'password' => Hash::make('password'),
                'role_id' => 5,
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}
