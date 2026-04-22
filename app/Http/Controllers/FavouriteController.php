<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FavouriteController extends Controller
{
    // Alle Favoriten des eingeloggten Users
    public function index()
    {
        $favourites = Auth::user()
            ->favourites()
            ->with('address')
            ->where('status', 'active')
            ->get();

        return response()->json($favourites);
    }

    // Favorit hinzufügen
    public function store(Listing $listing)
    {
        Auth::user()->favourites()->syncWithoutDetaching([$listing->id]);

        return response()->json(['message' => 'Favorit hinzugefügt']);
    }

    // Favorit entfernen
    public function destroy(Listing $listing)
    {
        Auth::user()->favourites()->detach($listing->id);

        return response()->json(['message' => 'Favorit entfernt']);
    }
}
