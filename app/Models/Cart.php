<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'date',
        'ordered_at'
    ];

    protected $casts = [
        'date' => 'datetime',
        'ordered_at' => 'datetime'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function cartProducts()
    {
        return $this->hasMany(CartProduct::class);
    }

    public function order()
    {
        return $this->hasOne(Order::class);
    }
}