<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Language extends Model
{
    protected $fillable = [
        'name',
        'icon_path',
    ];

    /**
     * A language can belong to multiple accounts.
     */
    public function accounts(): BelongsToMany
    {
        return $this->belongsToMany(Account::class, 'account_language')
            ->withTimestamps();
    }
}
