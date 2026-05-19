<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HostBookingController extends Controller
{
    /**
     * Alle Buchungen, die zu den Deskrls des eingeloggten Hosts gehören.
     * GET /host/bookings
     */
    public function index()
    {
        $bookings = Booking::query()
            ->whereHas('deskrl', function ($q) {
                $q->where('host_account_id', Auth::id());
            })
            ->with(['deskrl', 'account'])
            ->latest()
            ->get();

        return Inertia::render('Host/Bookings/Index', [
            'bookings' => $bookings,
        ]);
    }

    /**
     * Eine offene Buchung akzeptieren.
     * PATCH /host/bookings/{booking}/accept
     *
     * Status-Mapping (DB kennt nur pending|confirmed|cancelled):
     *   pending  --accept-->  confirmed
     */
    public function accept(Booking $booking)
    {
        $this->authorizeHostOwnsBooking($booking);

        if ($booking->status !== 'pending') {
            return redirect()->back()->withErrors([
                'status' => 'Nur offene (pending) Buchungen können akzeptiert werden.',
            ]);
        }

        $booking->update(['status' => 'confirmed']);

        // TODO (mit Team klären): Bestätigungsmail an Nutzer + ics-Kalenderdatei

        return redirect()->back();
    }

    /**
     * Eine offene Buchung ablehnen.
     * PATCH /host/bookings/{booking}/reject
     *
     * Status-Mapping: pending --reject--> cancelled
     * (DB hat keinen eigenen 'rejected'-Status, daher cancelled.
     *  Falls Unterscheidung später nötig: Migration um 'rejected' erweitern.)
     */
    public function reject(Booking $booking)
    {
        $this->authorizeHostOwnsBooking($booking);

        if ($booking->status !== 'pending') {
            return redirect()->back()->withErrors([
                'status' => 'Nur offene (pending) Buchungen können abgelehnt werden.',
            ]);
        }

        $booking->update(['status' => 'cancelled']);

        return redirect()->back();
    }

    /**
     * Eine bestätigte Buchung als Host stornieren.
     * PATCH /host/bookings/{booking}/cancel
     */
    public function cancel(Booking $booking)
    {
        $this->authorizeHostOwnsBooking($booking);

        if ($booking->status === 'cancelled') {
            return redirect()->back()->withErrors([
                'status' => 'Diese Buchung ist bereits storniert.',
            ]);
        }

        $booking->update(['status' => 'cancelled']);

        // TODO (mit Team klären): Info-Mail an Nutzer + Refund (payment_status)

        return redirect()->back();
    }

    // ---------- Hilfsmethode ----------

    /**
     * Stellt sicher, dass die Buchung zu einem Deskrl des eingeloggten Hosts gehört.
     */
    private function authorizeHostOwnsBooking(Booking $booking): void
    {
        $booking->loadMissing('deskrl');

        if (! $booking->deskrl || $booking->deskrl->host_account_id !== Auth::id()) {
            abort(403, 'Diese Buchung gehört nicht zu deinen Deskrls.');
        }
    }
}
