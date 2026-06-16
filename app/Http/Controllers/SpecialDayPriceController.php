<?php

namespace App\Http\Controllers;

use App\Models\Deskrl;
use App\Models\SpecialDayPrice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SpecialDayPriceController extends Controller
{
    /**
     * Shows all special day prices for the given Deskrl.
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
     * Stores or updates one special day price for the given Deskrl and date.
     */
    public function store(Request $request, Deskrl $deskrl)
    {
        $this->authorizeHost($deskrl);

        $validated = $request->validate([
            'date' => ['required', 'date', 'after_or_equal:today'],
            'special_price_per_day' => ['required', 'numeric', 'min:0'],
        ]);

        SpecialDayPrice::updateOrCreate(
            [
                'deskrl_id' => $deskrl->id,
                'date' => $validated['date'],
            ],
            [
                'special_price_per_day' => $validated['special_price_per_day'],
            ]
        );

        return redirect()->back();
    }

    /**
     * Updates an existing special day price for the given Deskrl.
     */
    public function update(Request $request, Deskrl $deskrl, SpecialDayPrice $specialDayPrice)
    {
        $this->authorizeHost($deskrl);
        $this->ensureBelongsToDeskrl($specialDayPrice, $deskrl);

        $validated = $request->validate([
            'date' => ['required', 'date'],
            'special_price_per_day' => ['required', 'numeric', 'min:0'],
        ]);

        $specialDayPrice->update($validated);

        return redirect()->back();
    }

    /**
     * Deletes a special day price from the given Deskrl.
     */
    public function destroy(Deskrl $deskrl, SpecialDayPrice $specialDayPrice)
    {
        $this->authorizeHost($deskrl);
        $this->ensureBelongsToDeskrl($specialDayPrice, $deskrl);

        $specialDayPrice->delete();

        return redirect()->back();
    }

    /**
     * Ensures that the currently logged-in account owns the given Deskrl.
     */
    private function authorizeHost(Deskrl $deskrl): void
    {
        if ($deskrl->host_account_id !== Auth::id()) {
            abort(403, 'Kein Zugriff auf dieses Deskrl.');
        }
    }

    /**
     * Ensures that the special day price belongs to the given Deskrl.
     */
    private function ensureBelongsToDeskrl(SpecialDayPrice $price, Deskrl $deskrl): void
    {
        if ($price->deskrl_id !== $deskrl->id) {
            abort(404);
        }
    }
}
