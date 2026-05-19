<?php

use App\Models\Deskrl;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\SpecialDayPriceController;
use App\Http\Controllers\SpecialAvailabilityController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\HostBookingController;

// =========================================================
// Hauptseite
// =========================================================
Route::get('/', function (Request $request) {
    $deskrls = Deskrl::query()
        ->where('status', 'active')
        ->get();

    return Inertia::render('Home', [
        'deskrls' => $deskrls,
    ]);
});

// =========================================================
// KELLYS ROUTES — Sonderzeiten, Sonderpreise, Favoriten, Buchungen
// =========================================================
// HINWEIS: Tobis auth-Middleware ist noch nicht aktiv.
// Sobald Login läuft, die middleware-Zeile + schließende Klammer
// am Ende wieder einkommentieren.

// Route::middleware(['auth'])->group(function () {   // <- später aktivieren

// ---- Favoriten ----
Route::get('/favorites', [FavoriteController::class, 'index'])->name('favorites.index');
Route::post('/favorites', [FavoriteController::class, 'store'])->name('favorites.store');
Route::delete('/favorites/{favorite}', [FavoriteController::class, 'destroy'])->name('favorites.destroy');

// ---- Sonderpreise (an ein Deskrl gebunden) ----
Route::get('/deskrls/{deskrl}/special-prices', [SpecialDayPriceController::class, 'index'])->name('special-prices.index');
Route::post('/deskrls/{deskrl}/special-prices', [SpecialDayPriceController::class, 'store'])->name('special-prices.store');
Route::put('/deskrls/{deskrl}/special-prices/{specialDayPrice}', [SpecialDayPriceController::class, 'update'])->name('special-prices.update');
Route::delete('/deskrls/{deskrl}/special-prices/{specialDayPrice}', [SpecialDayPriceController::class, 'destroy'])->name('special-prices.destroy');

// ---- Sonderverfügbarkeit (an ein Deskrl gebunden) ----
Route::get('/deskrls/{deskrl}/special-availability', [SpecialAvailabilityController::class, 'index'])->name('special-availability.index');
Route::post('/deskrls/{deskrl}/special-availability', [SpecialAvailabilityController::class, 'store'])->name('special-availability.store');
Route::put('/deskrls/{deskrl}/special-availability/{specialAvailability}', [SpecialAvailabilityController::class, 'update'])->name('special-availability.update');
Route::delete('/deskrls/{deskrl}/special-availability/{specialAvailability}', [SpecialAvailabilityController::class, 'destroy'])->name('special-availability.destroy');

// ---- Buchungen (Nutzer-Sicht) ----
Route::get('/bookings', [BookingController::class, 'index'])->name('bookings.index');
Route::get('/bookings/{booking}', [BookingController::class, 'show'])->name('bookings.show');
Route::post('/deskrls/{deskrl}/bookings', [BookingController::class, 'store'])->name('bookings.store');
Route::patch('/bookings/{booking}/cancel', [BookingController::class, 'cancel'])->name('bookings.cancel');

// ---- Buchungen (Host-Sicht) ----
Route::get('/host/bookings', [HostBookingController::class, 'index'])->name('host.bookings.index');
Route::patch('/host/bookings/{booking}/accept', [HostBookingController::class, 'accept'])->name('host.bookings.accept');
Route::patch('/host/bookings/{booking}/reject', [HostBookingController::class, 'reject'])->name('host.bookings.reject');
Route::patch('/host/bookings/{booking}/cancel', [HostBookingController::class, 'cancel'])->name('host.bookings.cancel');

// });   // <- später aktivieren (schließende Klammer der middleware-Gruppe)

// =========================================================
// Footer-Seiten (statisch)
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
// ⚠️ TEMPORÄRE TEST-ROUTE — VOR PUSH/ABGABE LÖSCHEN!
// =========================================================
Route::get('/kelly-test', function () {
    $log = [];
    $account = \App\Models\Account::where('account_type', 'user')->first();
    $deskrl  = \App\Models\Deskrl::first();
    if (! $account) { return response('Kein User-Account. Erst migrate:fresh --seed.'); }
    if (! $deskrl)  { return response('Kein Deskrl. Erst migrate:fresh --seed.'); }

    $log[] = "Test-Account ID: {$account->id} ({$account->email})";
    $log[] = "Test-Deskrl ID: {$deskrl->id}";
    $log[] = "Deskrl Host-Account ID: {$deskrl->host_account_id}";
    $log[] = str_repeat('-', 50);

    // 1. FAVORIT
    try {
        $fav = \App\Models\Favorite::firstOrCreate(['user_id' => $account->id, 'deskrl_id' => $deskrl->id]);
        $log[] = "OK  Favorit angelegt (ID {$fav->id})";
        $fav->delete();
        $log[] = "OK  Favorit geloescht";
    } catch (\Throwable $e) { $log[] = "ERR Favorit: ".$e->getMessage(); }

    // 2. SONDERPREIS
    try {
        $p = \App\Models\SpecialDayPrice::updateOrCreate(
            ['deskrl_id' => $deskrl->id, 'date' => '2026-09-01'],
            ['special_price_per_day' => 99.00]);
        $log[] = "OK  Sonderpreis angelegt (99.00)";
        $p->update(['special_price_per_day' => 149.00]);
        $log[] = "OK  Sonderpreis geaendert (149.00)";
        $p->delete();
        $log[] = "OK  Sonderpreis geloescht";
    } catch (\Throwable $e) { $log[] = "ERR Sonderpreis: ".$e->getMessage(); }

    // 3. SONDERVERFUEGBARKEIT
    try {
        $sa = \App\Models\SpecialAvailability::updateOrCreate(
            ['deskrl_id' => $deskrl->id, 'exception_date' => '2026-09-02'],
            ['start_time' => '10:00:00', 'end_time' => '15:00:00']);
        $log[] = "OK  Sonderverfuegbarkeit angelegt (10-15 Uhr)";
        $sa->update(['start_time' => '08:00:00', 'end_time' => '12:00:00']);
        $log[] = "OK  Sonderverfuegbarkeit geaendert (08-12 Uhr)";
        $sa->delete();
        $log[] = "OK  Sonderverfuegbarkeit geloescht";
    } catch (\Throwable $e) { $log[] = "ERR Sonderverfuegbarkeit: ".$e->getMessage(); }

use App\Http\Controllers\AvailabilityController;
use App\Http\Controllers\DeskrlAddressController;
use App\Http\Controllers\DeskrlController;
use App\Http\Controllers\DeskrlImageController;
use App\Http\Controllers\DeskrlUtilityController;
use App\Models\Deskrl;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
    // 4-6. BUCHUNG  (Status: pending -> confirmed -> cancelled)
    try {
        $addr = \App\Models\Address::first();
        $rate = $deskrl->price_per_half_day ?? 50;
        $b = \App\Models\Booking::create([
            'user_id' => $account->id,
            'deskrl_id' => $deskrl->id,
            'billing_address_id' => $addr ? $addr->id : null,
            'from' => now()->addDays(5)->setTime(9, 0),
            'until' => now()->addDays(5)->setTime(13, 0),
            'booking_date' => now(),
            'price_rate' => $rate,
            'price' => $rate,
            'status' => 'pending',
            'payment_status' => 'unpaid',
        ]);
        $log[] = "OK  Buchung erstellt (ID {$b->id}, Status pending)";
        $b->update(['status' => 'confirmed']);
        $log[] = "OK  Host hat akzeptiert (Status confirmed)";
        $b->update(['status' => 'cancelled']);
        $log[] = "OK  Storniert (Status cancelled)";
        $b->delete();
        $log[] = "OK  Test-Buchung geloescht";
    } catch (\Throwable $e) { $log[] = "ERR Buchung: ".$e->getMessage(); }

    $log[] = str_repeat('-', 50);
    $log[] = "FERTIG. Alle OK = Business-Logik funktioniert. ERR = Problem.";

    return response('<pre style="font-size:15px;line-height:1.7">'.implode("\n", $log).'</pre>');
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

// Deskrl address
Route::post('/deskrls/{deskrl}/address', [DeskrlAddressController::class, 'store'])
    ->name('deskrls.address.store');
Route::put('/deskrls/{deskrl}/address', [DeskrlAddressController::class, 'update'])
    ->name('deskrls.address.update');
Route::delete('/deskrls/{deskrl}/address', [DeskrlAddressController::class, 'destroy'])
    ->name('deskrls.address.destroy');

// Deskrl utilities
Route::post('/deskrls/{deskrl}/utilities/sync', [DeskrlUtilityController::class, 'sync'])
    ->name('deskrls.utilities.sync');

Route::post('/deskrls/{deskrl}/utilities', [DeskrlUtilityController::class, 'store'])
    ->name('deskrls.utilities.store');

Route::put('/deskrls/{deskrl}/utilities/{utility}', [DeskrlUtilityController::class, 'update'])
    ->name('deskrls.utilities.update');

Route::delete('/deskrls/{deskrl}/utilities/{utility}', [DeskrlUtilityController::class, 'destroy'])
    ->name('deskrls.utilities.destroy');

// Deskrl images
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

// Deskrl availabilities
Route::get('/deskrls/{deskrl}/availabilities', [AvailabilityController::class, 'index'])
    ->name('deskrls.availabilities.index');

Route::post('/deskrls/{deskrl}/availabilities', [AvailabilityController::class, 'store'])
    ->name('deskrls.availabilities.store');

Route::put('/deskrls/{deskrl}/availabilities/{availability}', [AvailabilityController::class, 'update'])
    ->name('deskrls.availabilities.update');

Route::post('/deskrls/{deskrl}/availabilities/sync', [AvailabilityController::class, 'sync'])
    ->name('deskrls.availabilities.sync');
