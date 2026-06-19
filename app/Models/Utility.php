<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Utility extends Model
{
    protected $fillable = [
        'utility_category_id',
        'name',
    ];

    protected $casts = [
        'name' => 'array',
    ];

    /**
     * A utility belongs to one utility category.
     */
    public function utilityCategory(): BelongsTo
    {
        return $this->belongsTo(UtilityCategory::class);
    }

    /**
     * A utility can belong to multiple Deskrls through the pivot table.
     */
    public function deskrls(): BelongsToMany
    {
        return $this->belongsToMany(Deskrl::class, 'deskrl_utility');
    }
}
