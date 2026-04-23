<?php

use App\Http\Controllers\FavouriteController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ListingController;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Test
Route::get('/users', [UserController::class, 'index']);

// =========================================================
// Header
// =========================================================
use App\Models\Listing;

// Ausstattungs-Filter sind aktuell nur visuell,
// sie werden noch nicht ans Backend geschickt.
Route::get('/', function (\Illuminate\Http\Request $request) {
    $query = \App\Models\Listing::query()->where('status', 'active');

    if ($request->filled('search')) {
        $query->where(function($q) use ($request) {
            $q->where('title', 'like', '%' . $request->search . '%')
                ->orWhere('description', 'like', '%' . $request->search . '%')
                ->orWhereHas('address', function($aq) use ($request) {
                    $aq->where('city', 'like', '%' . $request->search . '%')
                        ->orWhere('street', 'like', '%' . $request->search . '%')
                        ->orWhere('postal_code', 'like', '%' . $request->search . '%');
                });
        });
    }

    if ($request->filled('type')) {
        $query->where('type', $request->type);
    }

    // Verfügbarkeits-Filter
    if ($request->filled('date') && $request->filled('start_time') && $request->filled('end_time')) {
        $weekday = strtolower(date('l', strtotime($request->date)));

        $query->whereHas('availability', function($q) use ($request, $weekday) {
            $q->where('weekday', $weekday)
                ->where('start_time', '<=', $request->start_time)
                ->where('end_time', '>=', $request->end_time);
        });
    }

    return Inertia::render('Home', [
        'listings' => $query->with('address')->get(),
        'filters' => $request->only(['search', 'type', 'date', 'start_time', 'end_time']),
    ]);
});

Route::get('/bookings', function () {
    return Inertia::render('Bookings');
});

Route::get('/favorites', function () {
    $listings = \App\Models\Listing::where('status', 'active')->with('address')->get();
    return Inertia::render('Favorites', ['listings' => $listings]);
});

// =========================================================
// Profilansicht
// =========================================================

/*Route::get('/profile', function () {
    $user = User::where('role', 'user')->first();
    return Inertia::render('UserProfile', [
        'user' => $user,
    ]);
});*/

// =========================================================
// Footer
// =========================================================

Route::get('/faq-user', function () { return Inertia::render('FaqUser'); });
Route::get('/cancellation', function () { return Inertia::render('Cancellation'); });
Route::get('/support-user', function () { return Inertia::render('SupportUser'); });
Route::get('/become-provider', function () { return Inertia::render('BecomeProvider'); });
Route::get('/faq-provider', function () { return Inertia::render('FaqProvider'); });
Route::get('/support-provider', function () { return Inertia::render('SupportProvider'); });
Route::get('/about', function () { return Inertia::render('About'); });
Route::get('/career', function () { return Inertia::render('Career'); });
Route::get('/legal-notice', function () { return Inertia::render('LegalNotice'); });
Route::get('/terms', function () { return Inertia::render('Terms'); });
Route::get('/revocation', function () { return Inertia::render('Revocation'); });
Route::get('/privacy-policy', function () { return Inertia::render('PrivacyPolicy'); });
Route::get('/accessibility', function () { return Inertia::render('Accessibility'); });
Route::get('/contact', function () { return Inertia::render('Contact'); });
Route::get('/news', function () { return Inertia::render('News'); });

// =========================================================
// Auth Routes
// =========================================================
Route::get('/register', function () {
    return Inertia::render('Register');});
Route::get('/login', function () {
    return Inertia::render('Login');});
// GET - Registrierungsseite anzeigen
Route::get('/register', function () {
    return Inertia::render('Register');});

// GET - Login Seite anzeigen
Route::get('/login', function () {
    return Inertia::render('Login');});
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

Route::middleware('auth')->group(function () {
    Route::get('/profile', [UserController::class, 'show'])->name('profile');
    Route::put('/profile', [UserController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [UserController::class, 'destroy'])->name('profile.destroy');

    Route::get('/favourites', [FavouriteController::class, 'index']);
    Route::post('/favourites/{listing}', [FavouriteController::class, 'store']);
    Route::delete('/favourites/{listing}', [FavouriteController::class, 'destroy']);
});
