<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeskrlAddress extends Model
{
    protected $fillable = [
        'deskrl_id',
        'address_id',
    ];

    /**
     * The address link belongs to one Deskrl.
     */
    public function deskrl(): BelongsTo
    {
        return $this->belongsTo(Deskrl::class);
    }

    /**
     * The address link belongs to one Address.
     */
    public function address(): BelongsTo
    {
        return $this->belongsTo(Address::class);
    }
}
