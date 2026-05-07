<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Utility extends Model
{
    protected $fillable = [
        'utility_category_id',
        'name',
    ];

    protected $casts = [
        'name' => 'array',
    ];

    public function utilityCategory(): BelongsTo
    {
        return $this->belongsTo(UtilityCategory::class);
    }
}
