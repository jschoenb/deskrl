<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class DeskrlUtility extends Pivot
{
    protected $table = 'deskrl_utility';

    protected $fillable = [
        'deskrl_id',
        'utility_id',
        'quantity',
    ];

    protected $casts = [
        'quantity' => 'integer',
    ];

    /**
     * The utility assignment belongs to one Deskrl.
     */
    public function deskrl(): BelongsTo
    {
        return $this->belongsTo(Deskrl::class);
    }

    /**
     * The utility assignment belongs to one Utility.
     */
    public function utility(): BelongsTo
    {
        return $this->belongsTo(Utility::class);
    }
}
