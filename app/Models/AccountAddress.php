<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccountAddress extends Model
{
    use HasFactory;

    protected $fillable = [
        'account_id',
        'address_id',
        'is_default',
        'company_name',
        'vat_nr',
        'is_billing_address',
    ];

    protected $casts = [
        'is_default' => 'boolean',
        'is_billing_address' => 'boolean',
    ];

    /**
     * An account-address record belongs to one account.
     */
    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    /**
     * An account-address record belongs to one address.
     */
    public function address()
    {
        return $this->belongsTo(Address::class);
    }
}
