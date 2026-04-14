<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $fillable = [
        'country',
        'city',
        'street',
        'house_number',
        'postal_code',
        'listing_id'
    ];

    public function listing(){
        return $this->belongsTo(Listing::class);
    }
}
