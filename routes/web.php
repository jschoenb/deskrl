<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ListingController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*Route::inertia('/', 'welcome')->name('home');*/

//Test
Route::get('/users', [UserController::class, 'index']);

//=========================================================
//Header
//=========================================================
use App\Models\Listing;

Route::get('/', function (){
    return Inertia::render('Home', [
        'listings' => Listing::all()
    ]);
});
Route::get('/bookings', function (){return Inertia::render('Bookings');});
Route::get('/favorites', function (){return Inertia::render('Favorites');});


//=========================================================
//Footer
//=========================================================

//Links for normal users
Route::get('/faq-user', function (){return Inertia::render('FaqUser');});
Route::get('/cancellation', function (){return Inertia::render('Cancellation');});
Route::get('/support-user', function (){return Inertia::render('SupportUser');});

//Links for hosts
Route::get('/become-provider', function (){return Inertia::render('BecomeProvider');});
Route::get('/faq-provider', function (){return Inertia::render('FaqProvider');});
Route::get('/support-provider', function (){return Inertia::render('SupportProvider');});

//Links for Deskrl
Route::get('/about', function (){return Inertia::render('About');});
Route::get('/career', function (){return Inertia::render('Career');});
Route::get('/legal-notice', function (){return Inertia::render('LegalNotice');});
Route::get('/terms', function (){return Inertia::render('Terms');});
Route::get('/revocation', function (){return Inertia::render('Revocation');});
Route::get('/privacy-policy', function (){return Inertia::render('PrivacyPolicy');});
Route::get('/accessibility', function (){return Inertia::render('Accessibility');});
Route::get('/contact', function (){return Inertia::render('Contact');});
Route::get('/news', function (){return Inertia::render('News');});


//=========================================================
//Auth Routes
//=========================================================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

// --- GESCHÜTZTE BEREICHE ---
Route::middleware('auth')->group(function () {
    Route::get('/profile', [UserController::class, 'show'])->name('profile');
    Route::put('/profile/{user}', [UserController::class, 'update']);
    Route::delete('/profile/{user}', [UserController::class, 'destroy']);
});
