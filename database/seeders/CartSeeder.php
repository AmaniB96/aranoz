<?php

namespace Database\Seeders;

use App\Models\Cart;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class CartSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();

        Cart::create([
            'user_id' => $users->first()->id, 
            'date' => Carbon::now()->subDays(1),
        ]);

        Cart::create([
            'user_id' => $users->skip(1)->first()->id, 
            'date' => Carbon::now()->subHours(12),
        ]);

        Cart::create([
            'user_id' => $users->skip(2)->first()->id,
            'date' => Carbon::now()->subDays(3),
        ]);
    }
}