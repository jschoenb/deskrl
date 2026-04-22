<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*Route::inertia('/', 'welcome')->name('home');*/

//Test
Route::get('/users', [UserController::class, 'index']);

//=========================================================
//Header
//=========================================================
use App\Models\Listing;

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

    return Inertia::render('Home', [
        'listings' => $query->with('address')->get(),
        'filters' => $request->only(['search', 'type']),
    ]);
});
Route::get('/bookings', function (){return Inertia::render('Bookings');});
Route::get('/favorites', function () {
    $listings = \App\Models\Listing::where('status', 'active')->with('address')->get();
    return Inertia::render('Favorites', ['listings' => $listings]);
});


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
