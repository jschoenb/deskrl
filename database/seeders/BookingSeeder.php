<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\Address;
use App\Models\Booking;
use App\Models\Deskrl;
use Illuminate\Database\Seeder;

class BookingSeeder extends Seeder
{
    public function run(): void
    {
        $user = Account::query()
            ->where('account_type', 'user')
            ->first();

        $deskrl = Deskrl::query()->first();
        $billingAddress = Address::query()->first();

        if (!$user) {
            $this->command->warn('No user account found. Please seed accounts before bookings.');
            return;
        }

        if (!$deskrl) {
            $this->command->warn('No deskrl found. Please seed deskrls before bookings.');
            return;
        }

        Booking::query()->updateOrCreate(
            [
                'user_id' => $user->id,
                'deskrl_id' => $deskrl->id,
                'booking_date' => '2026-06-10',
            ],
            [
                'from' => '2026-06-15',
                'until' => '2026-06-15',
                'price_rate' => 'day',
                'price' => 100.00,
                'status' => 'confirmed',
                'payment_status' => 'paid',
                'billing_address_id' => $billingAddress?->id,
            ]
        );

        Booking::query()->updateOrCreate(
            [
                'user_id' => $user->id,
                'deskrl_id' => $deskrl->id,
                'booking_date' => '2026-06-20',
            ],
            [
                'from' => '2026-07-01',
                'until' => '2026-07-01',
                'price_rate' => 'day',
                'price' => 75.00,
                'status' => 'pending',
                'payment_status' => 'unpaid',
                'billing_address_id' => $billingAddress?->id,
            ]
        );
    }
}
