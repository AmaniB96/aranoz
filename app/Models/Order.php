<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'status',
        'cart_id'
    ];

    protected $casts = [
        'date' => 'datetime'
    ];

    public function cart()
    {
        return $this->belongsTo(Cart::class);
    }
}
