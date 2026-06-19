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
     * Shows all bookings of the currently logged-in user.
     */
    public function index()
    {
        $bookings = Booking::query()
            ->where('user_id', Auth::id())
            ->with(['deskrl.images', 'deskrl.deskrlAddress'])
            ->latest()
            ->get();

        return Inertia::render('Bookings', [
            'bookings' => $bookings,
        ]);
    }

    /**
     * Shows one booking in detail if it belongs to the currently logged-in user.
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
     * Creates a new booking request and checks login, availability, duration and price.
     */
    public function store(Request $request, Deskrl $deskrl)
    {
        if (!Auth::check()) {
            return redirect()->back()->withErrors([
                'booking' => 'Bitte melde dich an, um eine Buchung anzufragen.',
            ]);
        }

        if ($deskrl->status !== 'active') {
            return redirect()->back()->withErrors([
                'booking' => 'Dieses Deskrl ist aktuell nicht buchbar.',
            ]);
        }

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

        if ($until->lessThanOrEqualTo(now())) {
            return redirect()->back()->withErrors([
                'booking' => 'Der gewählte Zeitraum liegt bereits in der Vergangenheit.',
            ]);
        }

        if (
            in_array($validated['price_rate'], ['hourly', 'half_day'], true)
            && $from->lessThanOrEqualTo(now())
        ) {
            return redirect()->back()->withErrors([
                'booking' => 'Der gewählte Startzeitpunkt liegt bereits in der Vergangenheit.',
            ]);
        }

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
     * Cancels a booking from the user's perspective if it belongs to the current user.
     */
    public function cancel(Booking $booking)
    {
        if ($booking->user_id !== Auth::id()) {
            abort(403);
        }

        if ($booking->status === 'cancelled') {
            return redirect()->back()->withErrors([
                'booking' => 'Diese Buchung ist bereits storniert.',
            ]);
        }

        $booking->update([
            'status' => 'cancelled',
        ]);

        return redirect()->back()->with('success', 'Die Buchung wurde storniert.');
    }
}
