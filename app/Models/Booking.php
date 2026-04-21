<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'user_id',
        'listing_id',
        'start_time',
        'end_time',
        'price_rate',
        'price',
        'status',
        'booked_at',
    ];

    // Beziehungen
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function listing()
    {
        return $this->belongsTo(Listing::class);
    }
}
