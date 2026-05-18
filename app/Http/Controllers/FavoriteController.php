<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FavoriteController extends Controller
{
    /**
     * Liste aller Favoriten des eingeloggten Accounts.
     * GET /favorites
     */
    public function index()
    {
        $favorites = Favorite::query()
            ->where('user_id', Auth::id())
            ->with(['deskrl' => function ($q) {
                $q->with(['images', 'deskrlAddress', 'deskrlCategory']);
            }])
            ->latest()
            ->get();

        return Inertia::render('Favorites/Index', [
            'favorites' => $favorites,
        ]);
    }

    /**
     * Ein Deskrl als Favorit speichern.
     * POST /favorites
     *
     * Hinweis: Eure Kollegin hat listing_id -> deskrl_id umbenannt.
     * Falls eure Migration noch listing_id nutzt, hier (und im Model
     * Favorite::$fillable) entsprechend auf 'listing_id' zurückändern.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'deskrl_id' => ['required', 'exists:deskrls,id'],
        ]);

        // firstOrCreate verhindert doppelte Favoriten
        Favorite::firstOrCreate([
            'user_id'   => Auth::id(),
            'deskrl_id' => $validated['deskrl_id'],
        ]);

        return redirect()->back();
    }

    /**
     * Einen Favoriten wieder entfernen.
     * DELETE /favorites/{favorite}
     */
    public function destroy(Favorite $favorite)
    {
        // Nur eigene Favoriten löschen
        if ($favorite->user_id !== Auth::id()) {
            abort(403);
        }

        $favorite->delete();

        return redirect()->back();
    }
}

