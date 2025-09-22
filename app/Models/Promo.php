<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promo extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'discount',
        'active'
    ];

    protected $casts = [
        'active' => 'boolean',
        'discount' => 'decimal:2'
    ];

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
