<?php

namespace App\Http\Controllers;

use App\Models\Deskrl;
use App\Models\Favorite;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FavoriteController extends Controller
{
    /**
     * Shows the favorites page.
     *
     * The page receives all active Deskrls.
     * The frontend filters them by the favorite IDs from FavoritesContext.
     */
    public function index()
    {
        $deskrls = Deskrl::query()
            ->with([
                'deskrlCategory',
                'deskrlAddress.address',
                'images',
                'utilities',
            ])
            ->where('status', 'active')
            ->get();

        return Inertia::render('Favorites', [
            'deskrls' => $deskrls,
        ]);
    }

    /**
     * Returns only the favorite Deskrl IDs of the logged-in account.
     *
     * This is used by FavoritesContext to initialize the favorite state.
     */
    public function ids(Request $request)
    {
        $favoriteIds = Favorite::query()
            ->where('user_id', $request->user()->id)
            ->pluck('deskrl_id');

        return response()->json($favoriteIds);
    }

    /**
     * Saves one Deskrl as favorite for the logged-in account.
     */
    public function store(Request $request, Deskrl $deskrl)
    {
        Favorite::query()->firstOrCreate([
            'user_id' => $request->user()->id,
            'deskrl_id' => $deskrl->id,
        ]);

        return response()->json([
            'success' => true,
            'deskrl_id' => $deskrl->id,
        ]);
    }

    /**
     * Removes one Deskrl from the favorites of the logged-in account.
     */
    public function destroy(Request $request, Deskrl $deskrl)
    {
        Favorite::query()
            ->where('user_id', $request->user()->id)
            ->where('deskrl_id', $deskrl->id)
            ->delete();

        return response()->json([
            'success' => true,
            'deskrl_id' => $deskrl->id,
        ]);
    }
}
