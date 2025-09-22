<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Adress extends Model
{
     use HasFactory;

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'company_name',
        'address',
        'city',
        'district',
        'postcode',
        'phone',
        'email'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
