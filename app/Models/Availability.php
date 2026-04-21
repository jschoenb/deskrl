<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Availability extends Model
{
    protected $fillable = [
        'listing_id',
        'weekday',
        'start_time',
        'end_time'
    ];

    public function listing(){
        return $this->belongsTo(Listing::class);
    }
}
