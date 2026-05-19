<?php

use App\Http\Controllers\AvailabilityController;
use App\Http\Controllers\DeskrlAddressController;
use App\Http\Controllers\DeskrlController;
use App\Http\Controllers\DeskrlImageController;
use App\Http\Controllers\DeskrlUtilityController;
// use App\Http\Controllers\FavoriteController;
// use App\Http\Controllers\SpecialDayPriceController;
// use App\Http\Controllers\SpecialAvailabilityController;
// use App\Http\Controllers\BookingController;
// use App\Http\Controllers\HostBookingController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\CommercialAccountController;
use App\Http\Controllers\AddressController;
use App\Models\Deskrl;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// =========================================================
// Home
// =========================================================
/*Route::get('/', function (Request $request) {
    $deskrls = Deskrl::query()
        ->where('status', 'active')
        ->get();

    return Inertia::render('Home', [
        'deskrls' => $deskrls,
    ]);
});*/
Route::get('/', function (Request $request) {
    $deskrls = Deskrl::query()
        ->with([
            'deskrlCategory',
            'deskrlAddress.address',
            'images',
            'utilities',
        ])
        ->where('status', 'active')
        ->get();

    return Inertia::render('Home', [
        'deskrls' => $deskrls,
        'filters' => [
            'search' => $request->input('search'),
            'type' => $request->input('type'),
            'date' => $request->input('date'),
            'start_time' => $request->input('start_time'),
            'end_time' => $request->input('end_time'),
        ],
    ]);
});

// =========================================================
// Auth
// =========================================================
Route::get('/register', [AuthController::class, 'showRegister'])
    ->name('register');

Route::post('/register', [AuthController::class, 'register'])
    ->name('register.store');

Route::get('/login', [AuthController::class, 'showLogin'])
    ->name('login');

Route::post('/login', [AuthController::class, 'login'])
    ->name('login.store');

Route::post('/logout', [AuthController::class, 'logout'])
    ->name('logout');

/*// =========================================================
// Account / Profile
// =========================================================
Route::middleware(['auth'])->group(function () {
    Route::get('/profile', [AccountController::class, 'show'])
        ->name('account.show');

    Route::get('/profile/edit', [AccountController::class, 'edit'])
        ->name('account.edit');

    Route::put('/profile', [AccountController::class, 'update'])
        ->name('account.update');

    Route::delete('/profile', [AccountController::class, 'destroy'])
        ->name('account.destroy');

    // =========================================================
    // Commercial account
    // =========================================================
    Route::get('/commercial-account', [CommercialAccountController::class, 'show'])
        ->name('commercial-account.show');

    Route::get('/commercial-account/create', [CommercialAccountController::class, 'create'])
        ->name('commercial-account.create');

    Route::post('/commercial-account', [CommercialAccountController::class, 'store'])
        ->name('commercial-account.store');

    Route::get('/commercial-account/edit', [CommercialAccountController::class, 'edit'])
        ->name('commercial-account.edit');

    Route::put('/commercial-account', [CommercialAccountController::class, 'update'])
        ->name('commercial-account.update');
});*/

// =========================================================
// Static pages
// =========================================================
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

// =========================================================
// Deskrls
// =========================================================
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

// =========================================================
// Deskrl address
// =========================================================
Route::post('/deskrls/{deskrl}/address', [DeskrlAddressController::class, 'store'])
    ->name('deskrls.address.store');

Route::put('/deskrls/{deskrl}/address', [DeskrlAddressController::class, 'update'])
    ->name('deskrls.address.update');

Route::delete('/deskrls/{deskrl}/address', [DeskrlAddressController::class, 'destroy'])
    ->name('deskrls.address.destroy');

// =========================================================
// Deskrl utilities
// =========================================================
Route::post('/deskrls/{deskrl}/utilities/sync', [DeskrlUtilityController::class, 'sync'])
    ->name('deskrls.utilities.sync');

Route::post('/deskrls/{deskrl}/utilities', [DeskrlUtilityController::class, 'store'])
    ->name('deskrls.utilities.store');

Route::put('/deskrls/{deskrl}/utilities/{utility}', [DeskrlUtilityController::class, 'update'])
    ->name('deskrls.utilities.update');

Route::delete('/deskrls/{deskrl}/utilities/{utility}', [DeskrlUtilityController::class, 'destroy'])
    ->name('deskrls.utilities.destroy');

// =========================================================
// Deskrl images
// =========================================================
Route::get('/deskrls/{deskrl}/images', [DeskrlImageController::class, 'index'])
    ->name('deskrls.images.index');

Route::post('/deskrls/{deskrl}/images', [DeskrlImageController::class, 'store'])
    ->name('deskrls.images.store');

Route::delete('/deskrls/{deskrl}/images/{image}', [DeskrlImageController::class, 'destroy'])
    ->name('deskrls.images.destroy');

Route::patch('/deskrls/{deskrl}/images/{image}/main', [DeskrlImageController::class, 'setMain'])
    ->name('deskrls.images.setMain');

Route::patch('/deskrls/{deskrl}/images/reorder', [DeskrlImageController::class, 'reorder'])
    ->name('deskrls.images.reorder');

// =========================================================
// Deskrl availabilities
// =========================================================
Route::get('/deskrls/{deskrl}/availabilities', [AvailabilityController::class, 'index'])
    ->name('deskrls.availabilities.index');

Route::post('/deskrls/{deskrl}/availabilities', [AvailabilityController::class, 'store'])
    ->name('deskrls.availabilities.store');

Route::put('/deskrls/{deskrl}/availabilities/{availability}', [AvailabilityController::class, 'update'])
    ->name('deskrls.availabilities.update');

Route::post('/deskrls/{deskrl}/availabilities/sync', [AvailabilityController::class, 'sync'])
    ->name('deskrls.availabilities.sync');

/*
|--------------------------------------------------------------------------
| Kellys routes - currently disabled
|--------------------------------------------------------------------------
|
| Keep this block for later activation.
| When these routes are enabled, remove the temporary static /bookings
| and /favorites routes above to avoid duplicate routes.
|
*/

// ---- Favorites ----
// Route::get('/favorites', [FavoriteController::class, 'index'])->name('favorites.index');
// Route::post('/favorites', [FavoriteController::class, 'store'])->name('favorites.store');
// Route::delete('/favorites/{favorite}', [FavoriteController::class, 'destroy'])->name('favorites.destroy');

// ---- Special day prices ----
// Route::get('/deskrls/{deskrl}/special-prices', [SpecialDayPriceController::class, 'index'])->name('special-prices.index');
// Route::post('/deskrls/{deskrl}/special-prices', [SpecialDayPriceController::class, 'store'])->name('special-prices.store');
// Route::put('/deskrls/{deskrl}/special-prices/{specialDayPrice}', [SpecialDayPriceController::class, 'update'])->name('special-prices.update');
// Route::delete('/deskrls/{deskrl}/special-prices/{specialDayPrice}', [SpecialDayPriceController::class, 'destroy'])->name('special-prices.destroy');

// ---- Special availabilities ----
// Route::get('/deskrls/{deskrl}/special-availability', [SpecialAvailabilityController::class, 'index'])->name('special-availability.index');
// Route::post('/deskrls/{deskrl}/special-availability', [SpecialAvailabilityController::class, 'store'])->name('special-availability.store');
// Route::put('/deskrls/{deskrl}/special-availability/{specialAvailability}', [SpecialAvailabilityController::class, 'update'])->name('special-availability.update');
// Route::delete('/deskrls/{deskrl}/special-availability/{specialAvailability}', [SpecialAvailabilityController::class, 'destroy'])->name('special-availability.destroy');

// ---- Bookings - user perspective ----
// Route::get('/bookings', [BookingController::class, 'index'])->name('bookings.index');
// Route::get('/bookings/{booking}', [BookingController::class, 'show'])->name('bookings.show');
// Route::post('/deskrls/{deskrl}/bookings', [BookingController::class, 'store'])->name('bookings.store');
// Route::patch('/bookings/{booking}/cancel', [BookingController::class, 'cancel'])->name('bookings.cancel');

// ---- Bookings - host perspective ----
// Route::get('/host/bookings', [HostBookingController::class, 'index'])->name('host.bookings.index');
// Route::patch('/host/bookings/{booking}/accept', [HostBookingController::class, 'accept'])->name('host.bookings.accept');
// Route::patch('/host/bookings/{booking}/reject', [HostBookingController::class, 'reject'])->name('host.bookings.reject');
// Route::patch('/host/bookings/{booking}/cancel', [HostBookingController::class, 'cancel'])->name('host.bookings.cancel');

/*
|--------------------------------------------------------------------------
| Kellys temporary test route - currently disabled
|--------------------------------------------------------------------------
|
| This route contains local test logic and should not run in newDatabase.
|
*/

/*
Route::get('/kelly-test', function () {
    // Keep Kellys local test logic here only as commented reference.
});
*/
