<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'user_id',
        'deskrl_id',
        'from',
        'until',
        'booking_date',
        'price_rate',
        'price',
        'status',
        'payment_status',
        'billing_address_id',
    ];

    public function deskrl()
    {
        return $this->belongsTo(Deskrl::class, 'deskrl_id');
    }

    public function account()
    {
        return $this->belongsTo(Account::class, 'user_id');
    }

    public function billingAddress()
    {
        return $this->belongsTo(Address::class, 'billing_address_id');
    }
}
