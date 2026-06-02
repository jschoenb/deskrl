<?php

namespace App\Http\Controllers;

use App\Models\Deskrl;
use App\Models\Utility;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Deskrl::query()
            ->where('status', 'active');

        // ---- Search: location (address) OR title (German) ----
        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->where(function ($q) use ($search) {
                $q->where('title->de', 'like', '%'.$search.'%')
                    ->orWhereHas('deskrlAddress.address', function ($aq) use ($search) {
                        $aq->where('city', 'like', '%'.$search.'%')
                            ->orWhere('street', 'like', '%'.$search.'%')
                            ->orWhere('postal_code', 'like', '%'.$search.'%');
                    });
            });
        }

        // ---- Type filter (room category) ----
        if ($request->filled('type')) {
            $query->whereHas('deskrlCategory', function ($cq) use ($request) {
                $cq->where('name', $request->input('type'));
            });
        }

        // ---- Date + time (weekday derived from date) ----
        if ($request->filled('date') && $request->filled('start_time') && $request->filled('end_time')) {
            $weekday = strtolower(date('l', strtotime($request->input('date'))));

            $query->whereHas('availabilities', function ($q) use ($request, $weekday) {
                $q->where('weekday', $weekday)
                    ->where('start_time', '<=', $request->input('start_time'))
                    ->where('end_time', '>=', $request->input('end_time'));
            });
        }

        // ---- Utilities filter (deskrl must have ALL selected) ----
        if ($request->filled('amenities')) {
            $amenityIds = is_array($request->input('amenities'))
                ? $request->input('amenities')
                : explode(',', $request->input('amenities'));

            foreach ($amenityIds as $utilityId) {
                $query->whereHas('utilities', function ($uq) use ($utilityId) {
                    $uq->where('utilities.id', $utilityId);
                });
            }
        }

        $deskrls = $query
            ->with([
                'deskrlCategory',
                'deskrlAddress.address',
                'images',
                'utilities',
            ])
            ->get();

        $utilities = Utility::query()
            ->with('utilityCategory')
            ->get();

        return Inertia::render('Home', [
            'deskrls'  => $deskrls,
            'utilities' => $utilities,
            'filters'  => [
                'search'     => $request->input('search'),
                'type'       => $request->input('type'),
                'date'       => $request->input('date'),
                'start_time' => $request->input('start_time'),
                'end_time'   => $request->input('end_time'),
                'amenities'  => $request->input('amenities'),
            ],
        ]);
    }
}
