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
