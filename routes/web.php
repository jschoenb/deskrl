<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*Route::inertia('/', 'welcome')->name('home');*/

//Test
Route::get('/users', [UserController::class, 'index']);

//Header
use App\Models\Listing;

Route::get('/', function (){
    return Inertia::render('Home', [
        'listings' => Listing::all()
    ]);
});
Route::get('/bookings', function (){return Inertia::render('Bookings');});
Route::get('/favorites', function (){return Inertia::render('Favorites');});

//Footer
Route::get('/privacy-policy', function (){return Inertia::render('PrivacyPolicy');});
Route::get('/terms', function (){return Inertia::render('Terms');});
Route::get('/legal-notice', function (){return Inertia::render('LegalNotice');});
