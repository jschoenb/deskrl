<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DeskrlCategory extends Model
{
    protected $table = 'listing_categories';

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
        return $this->hasMany(Deskrl::class, 'listing_category_id');
    }
}
