<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Language extends Model
{
    protected $fillable = [
        'name',
        'icon_path',
    ];

    public function accounts(): BelongsToMany
    {
        return $this->belongsToMany(Account::class, 'account_language');
    }
}
