<?php

/*
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FavouriteController;
use App\Http\Controllers\UserController;
use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// =========================================================
// Test
// =========================================================
Route::get('/users', [UserController::class, 'index']);

// =========================================================
// Hauptseite mit Suche & Filter
// =========================================================
Route::get('/', function (Request $request) {
    $query = Listing::query()->where('status', 'active');

    if ($request->filled('search')) {
        $query->where(function ($q) use ($request) {
            $q->where('title', 'like', '%'.$request->search.'%')
                ->orWhere('description', 'like', '%'.$request->search.'%')
                ->orWhereHas('address', function ($aq) use ($request) {
                    $aq->where('city', 'like', '%'.$request->search.'%')
                        ->orWhere('street', 'like', '%'.$request->search.'%')
                        ->orWhere('postal_code', 'like', '%'.$request->search.'%');
                });
        });
    }

    if ($request->filled('type')) {
        $query->where('type', $request->type);
    }

    if ($request->filled('date') && $request->filled('start_time') && $request->filled('end_time')) {
        $weekday = strtolower(date('l', strtotime($request->date)));
        $query->whereHas('availability', function ($q) use ($request, $weekday) {
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

// =========================================================
// Statische Seiten
// =========================================================
Route::get('/bookings', fn () => Inertia::render('Bookings'));
Route::get('/favorites', function () {
    return Inertia::render('Favorites', [
        'listings' => Listing::where('status', 'active')->with('address')->get(),
    ]);
});

// =========================================================
// Footer-Seiten
// =========================================================
Route::get('/faq-user', fn () => Inertia::render('FaqUser'));
Route::get('/cancellation', fn () => Inertia::render('Cancellation'));
Route::get('/support-user', fn () => Inertia::render('SupportUser'));
Route::get('/become-provider', fn () => Inertia::render('BecomeProvider'));
Route::get('/faq-provider', fn () => Inertia::render('FaqProvider'));
Route::get('/support-provider', fn () => Inertia::render('SupportProvider'));
Route::get('/about', fn () => Inertia::render('About'));
Route::get('/career', fn () => Inertia::render('Career'));
Route::get('/legal-notice', fn () => Inertia::render('LegalNotice'));
Route::get('/terms', fn () => Inertia::render('Terms'));
Route::get('/revocation', fn () => Inertia::render('Revocation'));
Route::get('/privacy-policy', fn () => Inertia::render('PrivacyPolicy'));
Route::get('/accessibility', fn () => Inertia::render('Accessibility'));
Route::get('/contact', fn () => Inertia::render('Contact'));
Route::get('/news', fn () => Inertia::render('News'));

// =========================================================
// Auth
// =========================================================
Route::get('/register', fn () => Inertia::render('Register'));
Route::get('/login', fn () => Inertia::render('Login'));
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

// =========================================================
// Profil (eingeloggt)
// =========================================================
Route::middleware('auth')->group(function () {

    // Profil anzeigen
    Route::get('/profile', [UserController::class, 'show'])
        ->name('profile');

    // Persönliche Infos (Name, E-Mail, Beruf, etc.)
    Route::put('/profile', [UserController::class, 'update'])
        ->name('profile.update');

    // Wohnadresse (+ optional Rechnungsadresse wenn gleich)
    Route::put('/profile/address', [UserController::class, 'updateAddress'])
        ->name('profile.address');

    // Rechnungsadresse (nur wenn abweichend)
    Route::put('/profile/billing', [UserController::class, 'updateBilling'])
        ->name('profile.billing');

    // Profilbild
    Route::post('/profile/image', [UserController::class, 'updateImage'])
        ->name('profile.image');

    // Account löschen
    Route::delete('/profile', [UserController::class, 'destroy'])
        ->name('profile.destroy');

    // Favoriten
    Route::get('/favourites', [FavouriteController::class, 'index']);
    Route::post('/favourites/{listing}', [FavouriteController::class, 'store']);
    Route::delete('/favourites/{listing}', [FavouriteController::class, 'destroy']);
});*/

use App\Http\Controllers\DeskrlController;
use App\Models\Deskrl;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function (Request $request) {
    $deskrls = Deskrl::query()
        ->where('status', 'active')
        ->get();

    return Inertia::render('Home', [
        'deskrls' => $deskrls,
    ]);
});

Route::get('/bookings', fn () => Inertia::render('Bookings'));
Route::get('/favorites', fn () => Inertia::render('Favorites'));

Route::get('/faq-user', fn () => Inertia::render('FaqUser'));
Route::get('/cancellation', fn () => Inertia::render('Cancellation'));
Route::get('/support-user', fn () => Inertia::render('SupportUser'));
Route::get('/become-provider', fn () => Inertia::render('BecomeProvider'));
Route::get('/faq-provider', fn () => Inertia::render('FaqProvider'));
Route::get('/support-provider', fn () => Inertia::render('SupportProvider'));
Route::get('/about', fn () => Inertia::render('About'));
Route::get('/career', fn () => Inertia::render('Career'));
Route::get('/legal-notice', fn () => Inertia::render('LegalNotice'));
Route::get('/terms', fn () => Inertia::render('Terms'));
Route::get('/revocation', fn () => Inertia::render('Revocation'));
Route::get('/privacy-policy', fn () => Inertia::render('PrivacyPolicy'));
Route::get('/accessibility', fn () => Inertia::render('Accessibility'));
Route::get('/contact', fn () => Inertia::render('Contact'));
Route::get('/news', fn () => Inertia::render('News'));

// Deskrls
Route::get('/deskrls', [DeskrlController::class, 'index'])
    ->name('deskrls.index');
Route::get('/deskrls/create', [DeskrlController::class, 'create'])
    ->name('deskrls.create');
Route::post('/deskrls', [DeskrlController::class, 'store'])
    ->name('deskrls.store');
Route::get('/deskrls/{deskrl}/edit', [DeskrlController::class, 'edit'])
    ->name('deskrls.edit');
Route::put('/deskrls/{deskrl}', [DeskrlController::class, 'update'])
    ->name('deskrls.update');
Route::delete('/deskrls/{deskrl}', [DeskrlController::class, 'destroy'])
    ->name('deskrls.destroy');
Route::patch('/deskrls/{deskrl}/publish', [DeskrlController::class, 'publish'])
    ->name('deskrls.publish');
Route::patch('/deskrls/{deskrl}/archive', [DeskrlController::class, 'archive'])
    ->name('deskrls.archive');
Route::patch('/deskrls/{deskrl}/activate', [DeskrlController::class, 'activate'])
    ->name('deskrls.activate');
Route::patch('/deskrls/{deskrl}/deactivate', [DeskrlController::class, 'deactivate'])
    ->name('deskrls.deactivate');
Route::get('/deskrls/{deskrl}', [DeskrlController::class, 'show'])
    ->name('deskrls.show');
