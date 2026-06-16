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

    /**
     * A booking belongs to one Deskrl.
     */
    public function deskrl()
    {
        return $this->belongsTo(Deskrl::class, 'deskrl_id');
    }

    /**
     * A booking belongs to one user account.
     */
    public function account()
    {
        return $this->belongsTo(Account::class, 'user_id');
    }

    /**
     * A booking can have one billing address.
     */
    public function billingAddress()
    {
        return $this->belongsTo(Address::class, 'billing_address_id');
    }
}
