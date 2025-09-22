<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'width',
        'height',
        'depth',
        'weight',
        'quality_checking',
        'freshness_duration',
        'packaging_date',
        'box_content'
    ];

    protected $casts = [
        'width' => 'decimal:2',
        'height' => 'decimal:2',
        'depth' => 'decimal:2',
        'weight' => 'decimal:2',
        'quality_checking' => 'boolean',
        'packaging_date' => 'date'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}