<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HostBookingController extends Controller
{
    /**
     * Shows all bookings that belong to Deskrls of the currently logged-in host.
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
     * Accepts a pending booking and changes its status to confirmed.
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

        // TODO: Add confirmation email and calendar file once the team has clarified this feature.

        return redirect()->back();
    }

    /**
     * Rejects a pending booking and changes its status to cancelled.
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
     * Cancels a booking from the host perspective.
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

        // TODO: Add user notification and refund handling once payment logic is implemented.

        return redirect()->back();
    }

    /**
     * Ensures that the booking belongs to a Deskrl of the currently logged-in host.
     */
    private function authorizeHostOwnsBooking(Booking $booking): void
    {
        $booking->loadMissing('deskrl');

        if (! $booking->deskrl || $booking->deskrl->host_account_id !== Auth::id()) {
            abort(403, 'Diese Buchung gehört nicht zu deinen Deskrls.');
        }
    }
}
