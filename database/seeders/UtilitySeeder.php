<?php

namespace Database\Seeders;

use App\Models\Utility;
use Illuminate\Database\Seeder;

class UtilitySeeder extends Seeder
{
    public function run(): void
    {
        $utilities = [
            'WLAN',
            'Beamer',
            'Whiteboard',
            'Flipchart',
            'Küche',
            'Kaffeemaschine',
            'Parkplatz',
            'Klimaanlage',
            'Drucker',
            'Barrierefrei',
        ];

        foreach ($utilities as $utility) {
            Utility::create([
                'name' => $utility,
            ]);
        }
    }
}
