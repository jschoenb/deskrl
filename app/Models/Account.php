<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Account extends Model
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

    public function commercialAccount()
    {
        return $this->hasOne(CommercialAccount::class);
    }

    public function languages()
    {
        return $this->belongsToMany(Language::class, 'account_language')
            ->withTimestamps();
    }

    public function accountAddresses()
    {
        return $this->hasMany(AccountAddress::class);
    }

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

    public function deskrls()
    {
        return $this->hasMany(Deskrl::class, 'host_account_id');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class, 'user_id');
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class, 'user_id');
    }
}
