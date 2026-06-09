<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Deskrl;
use App\Models\SpecialDayPrice;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BookingController extends Controller
{
    /**
     * Alle Buchungen des eingeloggten Accounts (Nutzer-Sicht).
     * GET /bookings
     */
    public function index()
    {
        $bookings = Booking::query()
            ->where('user_id', Auth::id())
            ->with(['deskrl.images', 'deskrl.deskrlAddress'])
            ->latest()
            ->get();

        return Inertia::render('Bookings/Index', [
            'bookings' => $bookings,
        ]);
    }

    /**
     * Eine einzelne Buchung im Detail.
     * GET /bookings/{booking}
     */
    public function show(Booking $booking)
    {
        if ($booking->user_id !== Auth::id()) {
            abort(403);
        }

        $booking->load(['deskrl.images', 'deskrl.deskrlAddress', 'billingAddress']);

        return Inertia::render('Bookings/Show', [
            'booking' => $booking,
        ]);
    }

    /**
     * Neue Buchung erstellen.
     * POST /deskrls/{deskrl}/bookings
     *
     * Prüfungen:
     * - Ist der User eingeloggt?
     * - Ist der Deskrl aktiv und buchbar?
     * - Sind Zeitraum und Buchungsrate gültig?
     * - Liegt der Zeitraum nicht vollständig in der Vergangenheit?
     * - Entspricht der Zeitraum min_hours / max_hours?
     * - Überschneidet sich die Buchung mit bestehenden Buchungen?
     * - Ist für die gewählte Buchungsrate ein Preis hinterlegt?
     *
     * Status-Werte laut Migration:
     * - pending
     * - confirmed
     * - cancelled
     *
     * Neue Buchungen starten als pending.
     * Bei instant_bookable starten sie direkt als confirmed.
     */
    public function store(Request $request, Deskrl $deskrl)
    {
        // Fallback, falls die Route versehentlich ohne auth-Middleware erreichbar ist.
        if (!Auth::check()) {
            return redirect()->back()->withErrors([
                'booking' => 'Bitte melde dich an, um eine Buchung anzufragen.',
            ]);
        }

        // 1) Ist der Deskrl buchbar?
        if ($deskrl->status !== 'active') {
            return redirect()->back()->withErrors([
                'booking' => 'Dieses Deskrl ist aktuell nicht buchbar.',
            ]);
        }

        // 2) Eingaben validieren
        $validated = $request->validate(
            [
                'from' => ['required', 'date'],
                'until' => ['required', 'date', 'after:from'],
                'price_rate' => ['required', 'in:hourly,half_day,daily,weekly,monthly'],
                'billing_address_id' => ['nullable', 'exists:addresses,id'],
            ],
            [
                'from.required' => 'Bitte wähle ein Datum für die Buchung aus.',
                'from.date' => 'Das gewählte Startdatum ist ungültig.',

                'until.required' => 'Bitte wähle einen gültigen Endzeitpunkt aus.',
                'until.date' => 'Der gewählte Endzeitpunkt ist ungültig.',
                'until.after' => 'Der Endzeitpunkt muss nach dem Startzeitpunkt liegen.',

                'price_rate.required' => 'Bitte wähle eine Buchungsart aus.',
                'price_rate.in' => 'Die gewählte Buchungsart ist ungültig.',

                'billing_address_id.exists' => 'Die gewählte Rechnungsadresse wurde nicht gefunden.',
            ]
        );

        $from = Carbon::parse($validated['from']);
        $until = Carbon::parse($validated['until']);

        // 3) Zeitraum gegen Vergangenheit prüfen.
        // Wichtig:
        // Tages-, Wochen- und Monatsbuchungen können technisch um 00:00 starten.
        // Deshalb wird hier nicht pauschal "from > now" validiert.
        if ($until->lessThanOrEqualTo(now())) {
            return redirect()->back()->withErrors([
                'booking' => 'Der gewählte Zeitraum liegt bereits in der Vergangenheit.',
            ]);
        }

        // Bei stundenweisen und halbtägigen Buchungen soll der Startzeitpunkt noch in der Zukunft liegen.
        if (
            in_array($validated['price_rate'], ['hourly', 'half_day'], true)
            && $from->lessThanOrEqualTo(now())
        ) {
            return redirect()->back()->withErrors([
                'booking' => 'Der gewählte Startzeitpunkt liegt bereits in der Vergangenheit.',
            ]);
        }

        // 4) Zeitraum gegen Deskrl-Settings prüfen
        $hours = $from->diffInMinutes($until) / 60;

        if ($deskrl->min_hours && $hours < $deskrl->min_hours) {
            return redirect()->back()->withErrors([
                'booking' => "Die Mindestbuchungsdauer beträgt {$deskrl->min_hours} Stunden.",
            ]);
        }

        if ($deskrl->max_hours && $hours > $deskrl->max_hours) {
            return redirect()->back()->withErrors([
                'booking' => "Die maximale Buchungsdauer beträgt {$deskrl->max_hours} Stunden.",
            ]);
        }

        // 5) Überschneidung mit bestehenden Buchungen prüfen.
        // Nur aktive Buchungen blockieren neue Buchungen: pending oder confirmed.
        //
        // Saubere Overlap-Logik:
        // Eine bestehende Buchung überschneidet sich, wenn:
        // existing.from < requested.until
        // AND
        // existing.until > requested.from
        //
        // Dadurch blockiert eine Buchung, die exakt beim neuen Start endet, nicht unnötig.
        $overlap = Booking::query()
            ->where('deskrl_id', $deskrl->id)
            ->whereIn('status', ['pending', 'confirmed'])
            ->where('from', '<', $until)
            ->where('until', '>', $from)
            ->exists();

        if ($overlap) {
            return redirect()->back()->withErrors([
                'booking' => 'Dieser Zeitraum ist bereits belegt. Bitte wähle einen anderen Zeitraum.',
            ]);
        }

        // 6) Preis ermitteln: Sonderpreis hat Vorrang vor Standardpreis.
        $special = SpecialDayPrice::query()
            ->where('deskrl_id', $deskrl->id)
            ->whereDate('date', $from->toDateString())
            ->first();

        if ($special && $special->special_price_per_day !== null) {
            $price = $special->special_price_per_day;
        } else {
            $priceField = match ($validated['price_rate']) {
                'hourly' => 'price_per_hour',
                'half_day' => 'price_per_half_day',
                'daily' => 'price_per_day',
                'weekly' => 'price_per_week',
                'monthly' => 'price_per_month',
            };

            $price = $deskrl->$priceField;
        }

        if ($price === null) {
            return redirect()->back()->withErrors([
                'booking' => 'Für diese Buchungsart ist aktuell kein Preis hinterlegt.',
            ]);
        }

        // 7) Buchung anlegen.
        // price_rate speichert die gewählte Rate.
        // price speichert den Preis-Snapshot zum Zeitpunkt der Buchung.
        $booking = Booking::create([
            'user_id' => Auth::id(),
            'deskrl_id' => $deskrl->id,
            'billing_address_id' => $validated['billing_address_id'] ?? null,
            'from' => $from,
            'until' => $until,
            'booking_date' => now(),
            'price_rate' => $validated['price_rate'],
            'price' => $price,
            'status' => $deskrl->instant_bookable ? 'confirmed' : 'pending',
            'payment_status' => 'unpaid',
        ]);

        return redirect()->back()->with('success', 'Buchungsanfrage wurde gesendet.');
    }

    /**
     * Buchung aus Nutzer-Sicht stornieren.
     * PATCH /bookings/{booking}/cancel
     */
    public function cancel(Booking $booking)
    {
        if ($booking->user_id !== Auth::id()) {
            abort(403);
        }

        // Schon stornierte Buchung nicht erneut stornieren.
        if ($booking->status === 'cancelled') {
            return redirect()->back()->withErrors([
                'booking' => 'Diese Buchung ist bereits storniert.',
            ]);
        }

        $booking->update([
            'status' => 'cancelled',
        ]);

        // TODO (mit Team klären):
        // Kostenfreie Stornofrist, z. B. bis 3 Tage vorher.
        // Optional später: payment_status auf refunded setzen.

        return redirect()->back()->with('success', 'Die Buchung wurde storniert.');
    }
}
