<?php

use App\Http\Controllers\AvailabilityController;
use App\Http\Controllers\DeskrlAddressController;
use App\Http\Controllers\DeskrlController;
use App\Http\Controllers\DeskrlImageController;
use App\Http\Controllers\DeskrlUtilityController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// =========================================================
// Home
// =========================================================
Route::get('/', [HomeController::class, 'index'])
    ->name('home');

// =========================================================z
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
