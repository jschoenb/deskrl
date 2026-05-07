<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ListingCategory extends Model
{
    protected $fillable = [
        'name',
        'activated',
        'mask_type',
    ];

    protected $casts = [
        'activated' => 'boolean',
    ];
}
