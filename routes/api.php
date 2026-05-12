<?php

use App\Http\Controllers\DeskrlController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// public deskrl routes
Route::get('/deskrls', [DeskrlController::class, 'index']);
Route::get('/deskrls/{deskrl}', [DeskrlController::class, 'show']);
