<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommercialAccount extends Model
{
    use HasFactory;

    protected $fillable = [
        'account_id',
        'company_name',
        'company_nr',
        'vat_nr',
        'is_verified',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
    ];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }
}
