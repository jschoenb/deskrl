<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SpecialDayPrice extends Model
{
    protected $fillable = ['deskrl_id', 'date', 'special_price_per_day'];

    public function deskrl()
    {
        return $this->belongsTo(Deskrl::class, 'deskrl_id');
    }
}
