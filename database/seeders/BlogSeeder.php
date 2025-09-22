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
                'article' => 'MCSE boot camps have its supporters and its detractors. Some people do not understand why you should have to spend money on boot camp when you can get the MCSE study materials yourself at a fraction of the camp price. However, who has the willpower to actually sit through a self-imposed MCSE training. Who has the willpower to actually.',
                'image' => 'blog/m-blog-1.jpg',
                'blog_category_id' => 1,
                'user_id' => 1,
                'date' => now()->subDays(10),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'title' => 'Smartphones working on the moon ?',
                'article' => 'MCSE boot camps have its supporters and its detractors. Some people do not understand why you should have to spend money on boot camp when you can get the MCSE study materials yourself at a fraction of the camp price. However, who has the willpower to actually sit through a self-imposed MCSE training. Who has the willpower to actually.',
                'image' => 'blog/m-blog-2.jpg',
                'blog_category_id' => 1,
                'user_id' => 1,
                'date' => now()->subDays(8),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'title' => "Today's Fashion first tour",
                'article' => 'MCSE boot camps have its supporters and its detractors. Some people do not understand why you should have to spend money on boot camp when you can get the MCSE study materials yourself at a fraction of the camp price. However, who has the willpower to actually sit through a self-imposed MCSE training. Who has the willpower to actually.',
                'image' => 'blog/m-blog-3.jpg',
                'blog_category_id' => 1,
                'user_id' => 1,
                'date' => now()->subDays(5),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'title' => 'This daily cup of coffee could save your life !',
                'article' => 'MCSE boot camps have its supporters and its detractors. Some people do not understand why you should have to spend money on boot camp when you can get the MCSE study materials yourself at a fraction of the camp price. However, who has the willpower to actually sit through a self-imposed MCSE training. Who has the willpower to actually.',
                'image' => 'blog/m-blog-4.jpg',
                'blog_category_id' => 1,
                'user_id' => 1,
                'date' => now()->subDays(3),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'title' => 'Cup cakes & donuts worldwide consumption is growing',
                'article' => 'MCSE boot camps have its supporters and its detractors. Some people do not understand why you should have to spend money on boot camp when you can get the MCSE study materials yourself at a fraction of the camp price. However, who has the willpower to actually sit through a self-imposed MCSE training. Who has the willpower to actually.',
                'image' => 'blog/m-blog-5.jpg',
                'blog_category_id' => 1,
                'user_id' => 1,
                'date' => now()->subDays(1),
                'created_at' => now(),
                'updated_at' => now()
            ],
        ]);
    }
}
