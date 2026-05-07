<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UtilityCategory extends Model
{
    protected $fillable = [
        'category_name',
    ];

    protected $casts = [
        'category_name' => 'array',
    ];

    public function utilities(): HasMany
    {
        return $this->hasMany(Utility::class);
    }
}
