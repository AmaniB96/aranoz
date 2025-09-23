<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Adress extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'street',
        'state',
        'city',
        'number',
        'zip',
        'country'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
