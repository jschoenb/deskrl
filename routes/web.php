<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*Route::inertia('/', 'welcome')->name('home');*/

Route::get('/', function (){return Inertia::render('Home');});
Route::get('/users', [UserController::class, 'index']);
Route::get('/terms', function (){return Inertia::render('Terms');});
