<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Coupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'description',
        'discount_percentage',
        'discount_amount',
        'min_purchase_amount',
        'usage_limit',
        'usage_count',
        'expires_at',
        'is_active',
        'applicable_products',
        'applicable_categories',
    ];

    protected $casts = [
        'discount_percentage' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'min_purchase_amount' => 'decimal:2',
        'usage_limit' => 'integer',
        'usage_count' => 'integer',
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
        'applicable_products' => 'array',
        'applicable_categories' => 'array',
    ];

    /**
     * Vérifie si le coupon est valide
     */
    public function isValid($totalAmount = null)
    {
        // Vérifier si actif
        if (!$this->is_active) {
            return false;
        }

        // Vérifier la date d'expiration
        if ($this->expires_at && $this->expires_at->isPast()) {
            return false;
        }

        // Vérifier la limite d'utilisation
        if ($this->usage_limit && $this->usage_count >= $this->usage_limit) {
            return false;
        }

        // Vérifier le montant minimum d'achat
        if ($this->min_purchase_amount && $totalAmount && $totalAmount < $this->min_purchase_amount) {
            return false;
        }

        return true;
    }

    /**
     * Calcule le montant de réduction
     */
    public function calculateDiscount($totalAmount)
    {
        if (!$this->isValid($totalAmount)) {
            return 0;
        }

        if ($this->discount_percentage) {
            return $totalAmount * ($this->discount_percentage / 100);
        }

        if ($this->discount_amount) {
            return min($this->discount_amount, $totalAmount);
        }

        return 0;
    }

    /**
     * Incrémente le compteur d'utilisation
     */
    public function incrementUsage()
    {
        $this->increment('usage_count');
    }
}
