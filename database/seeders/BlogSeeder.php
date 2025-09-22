<?php

namespace Database\Seeders;

use App\Models\Blog;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BlogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Blog::insert([
            [
                'title' => 'Aranoz grand opening party',
                'article' => 'Découvrez l\'inauguration grandiose d\'Aranoz, où design et innovation se rencontrent pour célébrer le lancement de notre collection de meubles modernes.',
                'image' => 'blog/m-blog-1.jpg',
                'blog_category_id' => 1,
                'user_id' => 1,
                'date' => now()->subDays(10)->setTime(10, 0),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'title' => 'Smartphones working on the moon ?',
                'article' => 'Exploration des technologies futures : les smartphones pourraient-ils fonctionner sur la Lune ? Un regard sur l\'innovation spatiale.',
                'image' => 'blog/m-blog-2.jpg',
                'blog_category_id' => 1,
                'user_id' => 2,
                'date' => now()->subDays(8)->setTime(14, 30),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'title' => "Today's Fashion first tour",
                'article' => 'Le tour inaugural de la mode d\'aujourd\'hui : tendances, inspirations et conseils pour un style unique.',
                'image' => 'blog/m-blog-3.jpg',
                'blog_category_id' => 2,
                'user_id' => 1,
                'date' => now()->subDays(5)->setTime(9, 15),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'title' => 'This daily cup of coffee could save your life !',
                'article' => 'Les bienfaits surprenants d\'une tasse de café quotidienne : santé, énergie et longévité.',
                'image' => 'blog/m-blog-4.jpg',
                'blog_category_id' => 1,
                'user_id' => 3,
                'date' => now()->subDays(3)->setTime(16, 45),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'title' => 'Cup cakes & donuts worldwide consumption is growing',
                'article' => 'La consommation mondiale de cupcakes et donuts en hausse : tendances culinaires et impacts sur la société.',
                'image' => 'blog/m-blog-5.jpg',
                'blog_category_id' => 2,
                'user_id' => 1,
                'date' => now()->subDays(1)->setTime(11, 20),
                'created_at' => now(),
                'updated_at' => now()
            ],
        ]);
    }
}
