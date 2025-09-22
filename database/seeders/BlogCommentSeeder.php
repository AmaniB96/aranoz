<?php

namespace Database\Seeders;

use App\Models\BlogComment;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BlogCommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        BlogComment::create([
            'blog_id' => 1,
            'user_id' => 2,
            'comment' => 'Super article sur l\'inauguration ! J\'ai hâte de visiter.',
            'commented_at' => now()->subDays(9),
        ]);

        BlogComment::create([
            'blog_id' => 2,
            'user_id' => 3,
            'comment' => 'Intéressant sur les smartphones lunaires, mais est-ce réaliste ?',
            'commented_at' => now()->subDays(7),
        ]);

        BlogComment::create([
            'blog_id' => 3,
            'user_id' => 1,
            'comment' => 'La mode d\'aujourd\'hui est incroyable, merci pour les conseils !',
            'commented_at' => now()->subDays(4),
        ]);
    }
}
