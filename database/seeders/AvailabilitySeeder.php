<?php

namespace Database\Seeders;

use App\Models\Availability;
use App\Models\Deskrl;
use Illuminate\Database\Seeder;

class AvailabilitySeeder extends Seeder
{
    public function run(): void
    {
        $deskrls = Deskrl::query()->get();

        if ($deskrls->isEmpty()) {
            $this->command->warn('No deskrls found. Please seed deskrls before availabilities.');
            return;
        }

        $weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

        foreach ($deskrls as $deskrl) {
            foreach ($weekdays as $weekday) {
                Availability::query()->updateOrCreate(
                    [
                        'listing_id' => $deskrl->id,
                        'weekday' => $weekday,
                    ],
                    [
                        'start_time' => '08:00:00',
                        'end_time' => '18:00:00',
                    ]
                );
            }
        }
    }
}
