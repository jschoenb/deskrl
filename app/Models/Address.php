<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    use HasFactory;

    protected $fillable = [
        'country_id',
        'state',
        'city',
        'street',
        'house_nr',
        'postal_code',
        'stair',
        'door',
        'latitude',
        'longitude'
    ];

    /**
     * Cast coordinate values to a consistent decimal format.
     */
    protected $casts = [
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
    ];

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function accountAddresses()
    {
        return $this->hasMany(AccountAddress::class);
    }

    public function accounts()
    {
        return $this->belongsToMany(Account::class, 'account_addresses')
            ->withPivot([
                'is_default',
                'company_name',
                'vat_nr',
                'is_billing_address',
            ])
            ->withTimestamps();
    }

    public function deskrlAddresses()
    {
        return $this->hasMany(DeskrlAddress::class);
    }

    public function deskrls()
    {
        return $this->belongsToMany(Deskrl::class, 'deskrl_addresses')
            ->withTimestamps();
    }
}
