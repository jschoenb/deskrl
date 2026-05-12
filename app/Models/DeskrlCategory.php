<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeskrlCategory extends Model
{
    protected $fillable = [
        'name',
        'activated',
        'mask_type',
    ];

    protected $casts = [
        'activated' => 'boolean',
    ];

    public function deskrls(): HasMany
    {
        return $this->hasMany(Deskrl::class);
    }
}
