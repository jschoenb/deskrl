<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SpecialAvailability extends Model
{
    protected $fillable = ['deskrl_id', 'exception_date', 'start_time', 'end_time'];

    /**
     * A special availability belongs to one Deskrl.
     */
    public function deskrl()
    {
        return $this->belongsTo(Deskrl::class, 'deskrl_id');
    }
}
