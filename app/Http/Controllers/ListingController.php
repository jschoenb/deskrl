<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use Illuminate\Http\Request;

class ListingController extends Controller
{
    public function index(Request $request)
    {
        $query = Listing::query();

        // Suche nach Titel oder Beschreibung
        if ($request->has('search') && $request->search !== '') {
            $query->where(function($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                    ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        // Filter nach Typ (workspace, office, coworking, seminar, event)
        if ($request->has('type') && $request->type !== '') {
            $query->where('type', $request->type);
        }

        // Filter nach Kapazität (mindestens X Personen)
        if ($request->has('capacity') && $request->capacity !== '') {
            $query->where('capacity', '>=', $request->capacity);
        }

        // Nur aktive Listings anzeigen
        $query->where('status', 'active');

        // Mit Adresse und Hauptbild laden
        $listings = $query->with(['address', 'deskrlImages' => function($q) {
            $q->where('is_main', true);
        }])->get();

        return response()->json($listings);
    }
}
