<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        // ── Basis ──────────────────────────────────────────────────────────
        'name',
        'email',
        'password',
        'email_verified_at',
        'role',
        // ── Persönliche Infos ──────────────────────────────────────────────
        'gender',
        'profile_image',
        'job',
        'company',
        'about_me',
        'birthday',
        'phone',
        'languages',
        // ── Verifizierung ──────────────────────────────────────────────────
        'verification_status',
        // ── Wohnadresse ────────────────────────────────────────────────────
        'country',
        'street',
        'staircase',
        'apartment',
        'door',
        'postal_code',
        'city',
        'state',
        // ── Rechnungsadresse ───────────────────────────────────────────────
        'billing_company',
        'billing_vat_number',
        'billing_country',
        'billing_street',
        'billing_staircase',
        'billing_apartment',
        'billing_door',
        'billing_postal_code',
        'billing_city',
        'billing_state',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    // ── Relationships ──────────────────────────────────────────────────────

    public function host()
    {
        return $this->hasOne(Host::class);
    }

    public function favourites()
    {
        return $this->belongsToMany(Listing::class, 'favourites');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
