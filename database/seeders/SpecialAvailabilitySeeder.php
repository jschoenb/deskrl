<?php

namespace Database\Seeders;

use App\Models\Deskrl;
use App\Models\SpecialAvailability;
use Illuminate\Database\Seeder;

class SpecialAvailabilitySeeder extends Seeder
{
    public function run(): void
    {
        $deskrl = Deskrl::query()->first();

        if (!$deskrl) {
            $this->command->warn('No deskrl found. Please seed deskrls before special availabilities.');
            return;
        }

        SpecialAvailability::query()->updateOrCreate(
            [
                'deskrl_id' => $deskrl->id,
                'exception_date' => '2026-06-15',
            ],
            [
                'start_time' => '10:00:00',
                'end_time' => '16:00:00',
            ]
        );

        SpecialAvailability::query()->updateOrCreate(
            [
                'deskrl_id' => $deskrl->id,
                'exception_date' => '2026-07-01',
            ],
            [
                'start_time' => '09:00:00',
                'end_time' => '14:00:00',
            ]
        );
    }
}
