<?php

namespace Database\Seeders;

use App\Models\Deskrl;
use App\Models\SpecialDayPrice;
use Illuminate\Database\Seeder;

class SpecialDayPriceSeeder extends Seeder
{
    public function run(): void
    {
        $deskrl = Deskrl::query()->first();

        if (!$deskrl) {
            $this->command->warn('No deskrl found. Please seed deskrls before special day prices.');
            return;
        }

        SpecialDayPrice::query()->updateOrCreate(
            [
                'deskrl_id' => $deskrl->id,
                'date' => '2026-06-15',
            ],
            [
                'special_price_per_day' => 120.00,
            ]
        );

        SpecialDayPrice::query()->updateOrCreate(
            [
                'deskrl_id' => $deskrl->id,
                'date' => '2026-07-01',
            ],
            [
                'special_price_per_day' => 180.00,
            ]
        );
    }
}
