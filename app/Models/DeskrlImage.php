<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeskrlImage extends Model
{
    /*testhasdf*/
    protected $fillable = [
        'deskrl_id',
        'path',
        'is_main',
        'sort_order',
    ];

    protected $casts = [
        'is_main' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * The image belongs to one Deskrl.
     */
    public function deskrl(): BelongsTo
    {
        return $this->belongsTo(Deskrl::class);
    }
}
