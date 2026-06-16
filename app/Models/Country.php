<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    /**
     * A country can have multiple addresses.
     */
    public function addresses(): HasMany
    {
        return $this->hasMany(Address::class);
    }
}
