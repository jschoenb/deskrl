<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Availability extends Model
{
    protected $fillable = ['deskrl_id', 'weekday', 'start_time', 'end_time'];

    /**
     * An availability belongs to one Deskrl.
     */
    public function deskrl()
    {
        return $this->belongsTo(Deskrl::class, 'deskrl_id');
    }
}
