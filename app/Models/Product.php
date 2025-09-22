<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'description',
        'price',
        'image',
        'available',
        'product_category_id',
        'color_id',
        'promo_id'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'available' => 'boolean'
    ];

    public function productCategory()
    {
        return $this->belongsTo(ProductCategory::class);
    }

    public function color()
    {
        return $this->belongsTo(Color::class);
    }

    public function promo()
    {
        return $this->belongsTo(Promo::class);
    }

    public function productDetail()
    {
        return $this->hasOne(ProductDetail::class);
    }

    public function cartProducts()
    {
        return $this->hasMany(CartProduct::class);
    }

    public function likedByUsers()
    {
        return $this->belongsToMany(User::class, 'liked_products')->withTimestamps();
    }
}