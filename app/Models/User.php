<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;


//#[Fillable(['name', 'email', 'password'])]
//#[Hidden(['password', 'remember_token'])]

class User extends Authenticatable
{
//    /** @use HasFactory<UserFactory> */
//    use HasFactory, Notifiable;
//
//    /**
//     * Get the attributes that should be cast.
//     *
//     * @return array<string, string>
//     */
//    protected function casts(): array
//    {
//        return [
//            'email_verified_at' => 'datetime',
//            'password' => 'hashed',
//        ];
//    }

    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'email_verified_at',
        'role',
        'gender',
        'profile_image',
        'job',
        'company',
        'about_me',
        'birthday',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function host()
    {
        return $this->hasOne(Host::class);
    }

    public function favourites(){
        return $this->belongsToMany(Listing::class, 'favourites');
    }

    public function bookings(){
        return $this->hasMany(Booking::class);
    }

}
