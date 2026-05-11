<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Deskrl extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'host_account_id',
        'listing_category_id',
        'title',
        'description',
        'status',
        'capacity',
        'price_per_hour',
        'price_per_half_day',
        'price_per_day',
        'price_per_week',
        'price_per_month',
        'instant_bookable',
        'min_hours',
        'max_hours',
        'bookable_before_hours',
        'bookable_until_months',
    ];

    protected $casts = [
        'title' => 'array',
        'description' => 'array',
        'instant_bookable' => 'boolean',
        'price_per_hour' => 'decimal:2',
        'price_per_half_day' => 'decimal:2',
        'price_per_day' => 'decimal:2',
        'price_per_week' => 'decimal:2',
        'price_per_month' => 'decimal:2',
        'capacity' => 'integer',
        'min_hours' => 'integer',
        'max_hours' => 'integer',
        'bookable_before_hours' => 'integer',
        'bookable_until_months' => 'integer',
    ];

    /**
     * A Deskrl belongs to one host account.
     */
    public function hostAccount(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'host_account_id');
    }

    /**
     * A Deskrl belongs to one listing category.
     */
    public function listingCategory(): BelongsTo
    {
        return $this->belongsTo(ListingCategory::class, 'listing_category_id');
    }

    /**
     * A Deskrl can have multiple images.
     */
    public function images(): HasMany
    {
        return $this->hasMany(DeskrlImage::class);
    }

    /**
     * A Deskrl can have multiple regular availabilities.
     */
    public function availabilities(): HasMany
    {
        return $this->hasMany(Availability::class);
    }

    /**
     * A Deskrl can have multiple special availabilities.
     */
    public function specialAvailabilities(): HasMany
    {
        return $this->hasMany(SpecialAvailability::class);
    }

    /**
     * A Deskrl can have multiple special day prices.
     */
    public function specialDayPrices(): HasMany
    {
        return $this->hasMany(SpecialDayPrice::class);
    }

    /**
     * A Deskrl is linked to one address through the deskrl_addresses table.
     */
    public function deskrlAddress(): HasOne
    {
        return $this->hasOne(DeskrlAddress::class);
    }

    /**
     * A Deskrl can have multiple utilities.
     */
    public function utilities(): BelongsToMany
    {
        return $this->belongsToMany(Utility::class, 'deskrl_utility')
            ->withTimestamps();
    }

    /**
     * A Deskrl can be saved as favorite by multiple accounts.
     */
    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    /**
     * A Deskrl can have multiple bookings.
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}
