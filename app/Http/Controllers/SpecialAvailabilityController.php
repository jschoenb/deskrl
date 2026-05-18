<?php

namespace App\Http\Controllers;

use App\Models\SpecialAvailability;
use App\Models\Deskrl;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SpecialAvailabilityController extends Controller
{
    /**
     * Alle Sonderzeiten eines Deskrls anzeigen.
     * GET /deskrls/{deskrl}/special-availability
     *
     * Euer Model-Felder: exception_date, start_time, end_time.
     * "Geschlossen an einem Tag" wird abgebildet, indem start_time
     * und end_time leer (null) sind = an dem Tag keine Buchung möglich.
     */
    public function index(Deskrl $deskrl)
    {
        $this->authorizeHost($deskrl);

        $specialDays = SpecialAvailability::query()
            ->where('deskrl_id', $deskrl->id)
            ->orderBy('exception_date')
            ->get();

        return Inertia::render('Deskrl/SpecialAvailability/Index', [
            'deskrl'      => $deskrl,
            'specialDays' => $specialDays,
        ]);
    }

    /**
     * Sonderzeit für ein bestimmtes Datum speichern.
     * POST /deskrls/{deskrl}/special-availability
     */
    public function store(Request $request, Deskrl $deskrl)
    {
        $this->authorizeHost($deskrl);

        $validated = $request->validate([
            'exception_date' => ['required', 'date', 'after_or_equal:today'],
            // Beide null = an diesem Tag geschlossen.
            // Beide gesetzt = abweichende Öffnungszeit.
            'start_time'     => ['nullable', 'date_format:H:i'],
            'end_time'       => ['nullable', 'date_format:H:i', 'after:start_time'],
        ]);

        // Pro Deskrl + Datum nur EIN Eintrag → updateOrCreate
        SpecialAvailability::updateOrCreate(
            [
                'deskrl_id'      => $deskrl->id,
                'exception_date' => $validated['exception_date'],
            ],
            [
                'start_time' => $validated['start_time'] ?? null,
                'end_time'   => $validated['end_time'] ?? null,
            ]
        );

        return redirect()->back();
    }

    /**
     * Sonderzeit ändern.
     * PUT /deskrls/{deskrl}/special-availability/{specialAvailability}
     */
    public function update(Request $request, Deskrl $deskrl, SpecialAvailability $specialAvailability)
    {
        $this->authorizeHost($deskrl);
        $this->ensureBelongsToDeskrl($specialAvailability, $deskrl);

        $validated = $request->validate([
            'exception_date' => ['required', 'date'],
            'start_time'     => ['nullable', 'date_format:H:i'],
            'end_time'       => ['nullable', 'date_format:H:i', 'after:start_time'],
        ]);

        $specialAvailability->update($validated);

        return redirect()->back();
    }

    /**
     * Sonderzeit löschen (Deskrl fällt auf reguläre Wochenverfügbarkeit zurück).
     * DELETE /deskrls/{deskrl}/special-availability/{specialAvailability}
     */
    public function destroy(Deskrl $deskrl, SpecialAvailability $specialAvailability)
    {
        $this->authorizeHost($deskrl);
        $this->ensureBelongsToDeskrl($specialAvailability, $deskrl);

        $specialAvailability->delete();

        return redirect()->back();
    }

    // ---------- Hilfsmethoden ----------

    private function authorizeHost(Deskrl $deskrl): void
    {
        if ($deskrl->host_account_id !== Auth::id()) {
            abort(403, 'Kein Zugriff auf dieses Deskrl.');
        }
    }

    private function ensureBelongsToDeskrl(SpecialAvailability $entry, Deskrl $deskrl): void
    {
        if ($entry->deskrl_id !== $deskrl->id) {
            abort(404);
        }
    }
}

