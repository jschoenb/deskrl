<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Listing extends Model
{
    protected $fillable = [
        'host_id',
        'title',
        'description',
        'type',
        'status',
        'capacity',
        'price_per_hour',
        'price_per_half_day',
        'price_per_day',
        'price_per_week',
        'price_per_month',
        'instant_bookable',
    ];

    // Beziehungen
    public function host()
    {
        return $this->belongsTo(Host::class);
    }

    public function address(){
        return $this->hasOne(Address::class);
    }

    public function utilities(){
        return $this->belongsToMany(Utility::class, 'listing_utility');
    }

    public function bookings(){
        return $this->hasMany(Booking::class);
    }

    public function favouritedBy(){
        return $this->belongsToMany(User::class, 'favourites');
    }

    public function deskrlImages(){
        return $this->hasMany(ListingImage::class);
    }

    public function availability(){
        return $this->hasMany(Availability::class);
    }
}
