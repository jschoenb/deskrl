<?php

namespace App\Http\Controllers;

use App\Models\Deskrl;
use App\Models\SpecialAvailability;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SpecialAvailabilityController extends Controller
{
    /**
     * Shows all special availability entries for the given Deskrl.
     */
    public function index(Deskrl $deskrl)
    {
        $this->authorizeHost($deskrl);

        $specialDays = SpecialAvailability::query()
            ->where('deskrl_id', $deskrl->id)
            ->orderBy('exception_date')
            ->get();

        return Inertia::render('Deskrl/SpecialAvailability/Index', [
            'deskrl' => $deskrl,
            'specialDays' => $specialDays,
        ]);
    }

    /**
     * Stores or updates one special availability entry for the given Deskrl and date.
     */
    public function store(Request $request, Deskrl $deskrl)
    {
        $this->authorizeHost($deskrl);

        $validated = $request->validate([
            'exception_date' => ['required', 'date', 'after_or_equal:today'],
            'start_time' => ['nullable', 'date_format:H:i'],
            'end_time' => ['nullable', 'date_format:H:i', 'after:start_time'],
        ]);

        SpecialAvailability::updateOrCreate(
            [
                'deskrl_id' => $deskrl->id,
                'exception_date' => $validated['exception_date'],
            ],
            [
                'start_time' => $validated['start_time'] ?? null,
                'end_time' => $validated['end_time'] ?? null,
            ]
        );

        return redirect()->back();
    }

    /**
     * Updates an existing special availability entry for the given Deskrl.
     */
    public function update(Request $request, Deskrl $deskrl, SpecialAvailability $specialAvailability)
    {
        $this->authorizeHost($deskrl);
        $this->ensureBelongsToDeskrl($specialAvailability, $deskrl);

        $validated = $request->validate([
            'exception_date' => ['required', 'date'],
            'start_time' => ['nullable', 'date_format:H:i'],
            'end_time' => ['nullable', 'date_format:H:i', 'after:start_time'],
        ]);

        $specialAvailability->update($validated);

        return redirect()->back();
    }

    /**
     * Deletes a special availability entry so the Deskrl falls back to regular availability.
     */
    public function destroy(Deskrl $deskrl, SpecialAvailability $specialAvailability)
    {
        $this->authorizeHost($deskrl);
        $this->ensureBelongsToDeskrl($specialAvailability, $deskrl);

        $specialAvailability->delete();

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
     * Ensures that the special availability entry belongs to the given Deskrl.
     */
    private function ensureBelongsToDeskrl(SpecialAvailability $entry, Deskrl $deskrl): void
    {
        if ($entry->deskrl_id !== $deskrl->id) {
            abort(404);
        }
    }
}
