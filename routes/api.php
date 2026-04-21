<?php

use App\Http\Controllers\FavouriteController;
use App\Http\Controllers\ListingController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Öffentliche Auth-Routen
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);

// Öffentliche Listing-Routen
Route::get('/listings', [ListingController::class, 'index']);
Route::get('/listings/{listing}', [ListingController::class, 'show']);

// Geschützte Routen
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [UserController::class, 'logout']);

    // Favoriten des eingeloggten Users
    Route::get('/favourites', [FavouriteController::class, 'index']);

    // Favorit hinzufügen / entfernen
    Route::post('/favourites/{listing}', [FavouriteController::class, 'store']);
    Route::delete('/favourites/{listing}', [FavouriteController::class, 'destroy']);
});
