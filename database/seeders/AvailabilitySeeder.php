<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Listing;
use App\Models\Availability;

class AvailabilitySeeder extends Seeder
{
    public function run(): void
    {
        $listings = Listing::all();

        foreach ($listings as $listing) {
            // Montag bis Freitag verfügbar
            foreach (['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as $day) {
                Availability::create([
                    'listing_id' => $listing->id,
                    'weekday' => $day,
                    'start_time' => '08:00:00',
                    'end_time' => '18:00:00',
                ]);
            }
        }
    }
}
