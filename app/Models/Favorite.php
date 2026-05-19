<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    protected $fillable = ['user_id', 'deskrl_id'];

    public function deskrl()
    {
        return $this->belongsTo(Deskrl::class, 'deskrl_id');
    }

    public function account()
    {
        return $this->belongsTo(Account::class, 'user_id');
    }
}
