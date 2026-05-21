<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Favorite extends Model
{
    protected $fillable = [
        'user_id',
        'deskrl_id',
    ];

    /**
     * A favorite belongs to one Deskrl.
     */
    public function deskrl(): BelongsTo
    {
        return $this->belongsTo(Deskrl::class, 'deskrl_id');
    }

    /**
     * A favorite belongs to one account.
     */
    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'user_id');
    }
}
