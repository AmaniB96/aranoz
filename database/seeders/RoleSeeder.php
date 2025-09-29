<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        Role::query()->delete();
        Role::insert([
            ['name' => 'admin'],
            ['name' => 'agent'],
            ['name' => 'user'],
            ['name' => 'webmaster'],
            ['name' => 'cm'],
            ['name' => 'public']
        ]  
        );
    }
}
