<?php

namespace App\Http\Controllers;

use App\Models\SpecialDayPrice;
use App\Models\Deskrl;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SpecialDayPriceController extends Controller
{
    /**
     * Alle Sonderpreise eines bestimmten Deskrls anzeigen.
     * GET /deskrls/{deskrl}/special-prices
     */
    public function index(Deskrl $deskrl)
    {
        $this->authorizeHost($deskrl);

        $prices = SpecialDayPrice::query()
            ->where('deskrl_id', $deskrl->id)
            ->orderBy('date')
            ->get();

        return Inertia::render('Deskrl/SpecialPrices/Index', [
            'deskrl' => $deskrl,
            'prices' => $prices,
        ]);
    }

    /**
     * Neuen Sonderpreis für ein Datum speichern.
     * POST /deskrls/{deskrl}/special-prices
     */
    public function store(Request $request, Deskrl $deskrl)
    {
        $this->authorizeHost($deskrl);

        $validated = $request->validate([
            'date'                  => ['required', 'date', 'after_or_equal:today'],
            'special_price_per_day' => ['required', 'numeric', 'min:0'],
        ]);

        SpecialDayPrice::updateOrCreate(
            [
                'deskrl_id' => $deskrl->id,
                'date'      => $validated['date'],
            ],
            [
                'special_price_per_day' => $validated['special_price_per_day'],
            ]
        );

        return redirect()->back();
    }

    /**
     * Bestehenden Sonderpreis ändern.
     * PUT /deskrls/{deskrl}/special-prices/{specialDayPrice}
     */
    public function update(Request $request, Deskrl $deskrl, SpecialDayPrice $specialDayPrice)
    {
        $this->authorizeHost($deskrl);
        $this->ensureBelongsToDeskrl($specialDayPrice, $deskrl);

        $validated = $request->validate([
            'date'                  => ['required', 'date'],
            'special_price_per_day' => ['required', 'numeric', 'min:0'],
        ]);

        $specialDayPrice->update($validated);

        return redirect()->back();
    }

    /**
     * Sonderpreis löschen.
     * DELETE /deskrls/{deskrl}/special-prices/{specialDayPrice}
     */
    public function destroy(Deskrl $deskrl, SpecialDayPrice $specialDayPrice)
    {
        $this->authorizeHost($deskrl);
        $this->ensureBelongsToDeskrl($specialDayPrice, $deskrl);

        $specialDayPrice->delete();

        return redirect()->back();
    }

    // ---------- Hilfsmethoden ----------

    private function authorizeHost(Deskrl $deskrl): void
    {
        if ($deskrl->host_account_id !== Auth::id()) {
            abort(403, 'Kein Zugriff auf dieses Deskrl.');
        }
    }

    private function ensureBelongsToDeskrl(SpecialDayPrice $price, Deskrl $deskrl): void
    {
        if ($price->deskrl_id !== $deskrl->id) {
            abort(404);
        }
    }
}
