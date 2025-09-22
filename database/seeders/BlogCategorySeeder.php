<?php

namespace Database\Seeders;

use App\Models\BlogCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BlogCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        BlogCategory::insert([
            ['nom' => 'Travel'],
            ['nom' => 'Health Care'],
            ['nom' => 'Discover'],
            ['nom' => 'Fashion'],
            ['nom' => 'Business'],
        ]);
    }
}
