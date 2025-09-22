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
                'image' => 'storage/blog/m-blog-1.jpg',
                
                'title' => 'Aranoz grand opening party',
                'article' => 'MCSE boot camps have its supporters and its detractors. Some people do not understand why you should have to spend money on boot camp when you can get the MCSE study materials yourself at a fraction of the camp price. However, who has the willpower to actually sit through a self-imposed MCSE training. Who has the willpower to actually. ',
                'blog_category_id' => 5,
                'user_id' => 1
            ],
            [
                'image' => 'storage/blog/m-blog-2.jpg',
                
                'title' => 'Smartphones working on the moon ?',
                'article' => 'MCSE boot camps have its supporters and its detractors. Some people do not understand why you should have to spend money on boot camp when you can get the MCSE study materials yourself at a fraction of the camp price. However, who has the willpower to actually sit through a self-imposed MCSE training. Who has the willpower to actually. ',
                'blog_category_id' => 3,
                'user_id' => 1
            ],
            [
                'image' => 'storage/blog/m-blog-3.jpg',
                
                'title' => "Today's Fashion first tour",
                'article' => 'MCSE boot camps have its supporters and its detractors. Some people do not understand why you should have to spend money on boot camp when you can get the MCSE study materials yourself at a fraction of the camp price. However, who has the willpower to actually sit through a self-imposed MCSE training. Who has the willpower to actually. ',
                'blog_category_id' => 4,
                'user_id' => 1
            ],
            [
                'image' => 'storage/blog/m-blog-4.jpg',
                
                'title' => 'This daily cup of coffee could save your life !',
                'article' => 'MCSE boot camps have its supporters and its detractors. Some people do not understand why you should have to spend money on boot camp when you can get the MCSE study materials yourself at a fraction of the camp price. However, who has the willpower to actually sit through a self-imposed MCSE training. Who has the willpower to actually. ',
                'blog_category_id' => 2,
                'user_id' => 1
            ],
            [
                'image' => 'storage/blog/m-blog-5.jpg',
                
                'title' => 'Cup cakes & donuts worldwide consumption is growing',
                'article' => 'MCSE boot camps have its supporters and its detractors. Some people do not understand why you should have to spend money on boot camp when you can get the MCSE study materials yourself at a fraction of the camp price. However, who has the willpower to actually sit through a self-imposed MCSE training. Who has the willpower to actually. ',
                'blog_category_id' => 5,
                'user_id' => 1,
            ],
        ]);
    }
}
