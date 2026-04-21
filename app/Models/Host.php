<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Host extends Model
{
    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'is_company',
        'company_name',
        'company_nr',
        'vat_nr',
        'is_verified',
    ];

    // Beziehungen
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function listings()
    {
        return $this->hasMany(Listing::class);
    }
}
