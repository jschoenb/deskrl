<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class ListingUtility extends Pivot
{
    protected $fillable = [
      'listing_id',
      'utility_id'
    ];

    public function listing(){
        return $this->belongsTo(Listing::class);
    }

    public function utility(){
        return $this->belongsTo(Utility::class);
    }
}
