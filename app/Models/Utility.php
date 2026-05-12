<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/*jksdhfa*/
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
     * Eine Utility gehört zu einer Utility-Kategorie.
     */
    public function utilityCategory(): BelongsTo
    {
        return $this->belongsTo(UtilityCategory::class);
    }

    /**
     * Eine Utility kann mehreren Deskrls zugeordnet werden.
     * Pivot-Tabelle: deskrl_utility
     */
    public function deskrls(): BelongsToMany
    {
        return $this->belongsToMany(Deskrl::class, 'deskrl_utility');
    }
}
