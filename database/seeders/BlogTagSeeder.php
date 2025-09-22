<?php

namespace Database\Seeders;

use App\Models\BlogTag;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BlogTagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $blogTags = [
            ['blog_id' => 1, 'tag_id' => 1], 
            ['blog_id' => 1, 'tag_id' => 2],
            ['blog_id' => 2, 'tag_id' => 3],
            ['blog_id' => 2, 'tag_id' => 11],
            ['blog_id' => 3, 'tag_id' => 1],
            ['blog_id' => 3, 'tag_id' => 4],
            ['blog_id' => 4, 'tag_id' => 4],
            ['blog_id' => 4, 'tag_id' => 5],
            ['blog_id' => 5, 'tag_id' => 4],
            ['blog_id' => 5, 'tag_id' => 13],
        ];

        foreach ($blogTags as $bt) {
            BlogTag::create($bt);
        }
    }
}
