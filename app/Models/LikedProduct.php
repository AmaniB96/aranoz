<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LikedProduct extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'product_id',
    ];

    protected $table = 'liked_products';

    protected $primaryKey = null;
    public $incrementing = false;
    protected $keyType = 'array';

    protected function setKeysForSaveQuery($query)
    {
        $query->where('user_id', $this->user_id)
              ->where('product_id', $this->product_id);
        return $query;
    }
}