<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ListingImage extends Model
{
    protected $fillable = [
        'path',
        'listing_id',
        'is_main'
    ];

    public function listing(){
        return $this->belongsTo(Listing::class);
    }
}
