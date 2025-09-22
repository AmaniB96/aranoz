<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'article',
        'image',
        'blog_category_id',
        'user_id',
        'date'
    ];

    protected $casts = [
        'date' => 'datetime'
    ];

    public function blogCategory()
    {
        return $this->belongsTo(BlogCategory::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'blog_tags')->withTimestamps();
    }

    public function blogComments()
    {
        return $this->hasMany(BlogComment::class);
    }
}