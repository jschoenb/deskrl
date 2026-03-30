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
        'price_hourly',
        'price_half_day',
        'price_per_day',
        'price_per_week',
        'price_per_month',
    ];

    // Beziehungen
    public function host()
    {
        return $this->belongsTo(Host::class);
    }
}
