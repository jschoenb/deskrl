<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Account extends Authenticatable
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'email_verified',
        'account_type',
        'phone',
        'profile_image',
        'status',
        'birthdate',
        'gender',
        'about_me',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'email_verified' => 'boolean',
        'birthdate' => 'date',
        'about_me' => 'array',
    ];

    /**
     * An account can have one commercial account profile.
     */
    public function commercialAccount()
    {
        return $this->hasOne(CommercialAccount::class);
    }

    /**
     * An account can speak multiple languages.
     */
    public function languages()
    {
        return $this->belongsToMany(Language::class, 'account_language')
            ->withTimestamps();
    }

    /**
     * An account can have multiple account-address records.
     */
    public function accountAddresses()
    {
        return $this->hasMany(AccountAddress::class);
    }

    /**
     * An account can have multiple addresses through the account-address pivot table.
     */
    public function addresses()
    {
        return $this->belongsToMany(Address::class, 'account_addresses')
            ->withPivot([
                'is_default',
                'company_name',
                'vat_nr',
                'is_billing_address',
            ])
            ->withTimestamps();
    }

    /**
     * An account can host multiple Deskrls.
     */
    public function deskrls()
    {
        return $this->hasMany(Deskrl::class, 'host_account_id');
    }

    /**
     * An account can have multiple bookings as a user.
     */
    public function bookings()
    {
        return $this->hasMany(Booking::class, 'user_id');
    }

    /**
     * An account can save multiple Deskrls as favorites.
     */
    public function favorites()
    {
        return $this->hasMany(Favorite::class, 'user_id');
    }
}
