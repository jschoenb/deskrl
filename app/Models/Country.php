<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    protected $fillable = [
        'name',
        'symbol',
        'code',
        'currency',
        'currency_symbol',
    ];

    protected $casts = [
        'name' => 'array',
    ];
}
