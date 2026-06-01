<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Deskrl;
use App\Models\SpecialDayPrice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
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
     * Die vom Team verlangten Prüfungen:
     *  - Gibt es den Deskrl?       → Route-Model-Binding
     *  - Ist der Zeitraum gültig?  → Validierung + min/max + Overlap
     *  - Ist der Status korrekt?   → nur aktive Deskrls
     *  - Welche Rechnungsadresse?  → billing_address_id
     *  - Welcher Preis?            → Sonderpreis vor Standardpreis (Snapshot)
     *
     * Status-Werte laut Migration: pending | confirmed | cancelled
     * Neue Buchung startet als 'pending'. Bei instant_bookable direkt 'confirmed'.
     */
    public function store(Request $request, Deskrl $deskrl)
    {
        // 1) Ist der Deskrl buchbar?
        if ($deskrl->status !== 'active') {
            return redirect()->back()->withErrors([
                'deskrl' => 'Dieses Deskrl ist aktuell nicht buchbar.',
            ]);
        }

        // 2) Eingaben validieren
        $validated = $request->validate([
            'from'               => ['required', 'date', 'after:now'],
            'until'              => ['required', 'date', 'after:from'],
            'price_rate'         => ['required', 'in:hourly,half_day,daily,weekly,monthly'],
            'billing_address_id' => ['nullable', 'exists:addresses,id'],
        ]);

        $from  = Carbon::parse($validated['from']);
        $until = Carbon::parse($validated['until']);

        // 3) Zeitraum gegen Deskrl-Settings prüfen
        $hours = $from->diffInHours($until);
        if ($deskrl->min_hours && $hours < $deskrl->min_hours) {
            return redirect()->back()->withErrors([
                'from' => "Mindestbuchungsdauer: {$deskrl->min_hours} Stunden.",
            ]);
        }
        if ($deskrl->max_hours && $hours > $deskrl->max_hours) {
            return redirect()->back()->withErrors([
                'from' => "Maximale Buchungsdauer: {$deskrl->max_hours} Stunden.",
            ]);
        }

        // 4) Überschneidung mit bestehenden Buchungen prüfen
        //    (nur aktive Buchungen: pending oder confirmed)
        $overlap = Booking::query()
            ->where('deskrl_id', $deskrl->id)
            ->whereIn('status', ['pending', 'confirmed'])
            ->where(function ($q) use ($from, $until) {
                $q->whereBetween('from', [$from, $until])
                    ->orWhereBetween('until', [$from, $until])
                    ->orWhere(function ($q2) use ($from, $until) {
                        $q2->where('from', '<=', $from)
                            ->where('until', '>=', $until);
                    });
            })
            ->exists();

        if ($overlap) {
            return redirect()->back()->withErrors([
                'from' => 'Dieser Zeitraum ist bereits belegt.',
            ]);
        }

        // 5) Preis ermitteln: Sonderpreis (Tagespreis) hat Vorrang
        $special = SpecialDayPrice::query()
            ->where('deskrl_id', $deskrl->id)
            ->whereDate('date', $from->toDateString())
            ->first();

        if ($special && $special->special_price_per_day !== null) {
            $price = $special->special_price_per_day;
        } else {
            $priceField = match ($validated['price_rate']) {
                'hourly'   => 'price_per_hour',
                'half_day' => 'price_per_half_day',
                'daily'    => 'price_per_day',
                'weekly'   => 'price_per_week',
                'monthly'  => 'price_per_month',
            };
            $price = $deskrl->$priceField;
        }

        if ($price === null) {
            return redirect()->back()->withErrors([
                'price_rate' => 'Für diese Buchungsart ist kein Preis hinterlegt.',
            ]);
        }

        // 6) Buchung anlegen — Preis als Snapshot festschreiben.
        //    price_rate ist in eurer DB decimal -> wir speichern den
        //    Preis-pro-Einheit (gleich wie price, da Snapshot).
        $booking = Booking::create([
            'user_id'            => Auth::id(),
            'deskrl_id'          => $deskrl->id,
            'billing_address_id' => $validated['billing_address_id'] ?? null,
            'from'               => $from,
            'until'              => $until,
            'booking_date'       => now(),
            'price_rate'         => $validated['price_rate'],
            'price'              => $price,
            'status'             => $deskrl->instant_bookable ? 'confirmed' : 'pending',
            'payment_status'     => 'unpaid',
        ]);

//        return redirect()->route('bookings.show', $booking);
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

        // Schon stornierte Buchung nicht erneut stornieren
        if ($booking->status === 'cancelled') {
            return redirect()->back()->withErrors([
                'status' => 'Diese Buchung ist bereits storniert.',
            ]);
        }

        $booking->update([
            'status' => 'cancelled',
        ]);

        // TODO (mit Team klären): Stornofrist (kostenfrei bis 3 Tage vorher)
        //                          + Refund über payment_status = 'refunded'

        return redirect()->back();
    }
}
