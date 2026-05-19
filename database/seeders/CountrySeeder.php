<?php

namespace Database\Seeders;

use App\Models\Country;
use Illuminate\Database\Seeder;

class CountrySeeder extends Seeder
{
    public function run(): void
    {
        $countries = [
            [
                'code' => 'AT',
                'name' => [
                    'de' => 'Österreich',
                    'en' => 'Austria',
                ],
                'symbol' => '🇦🇹',
                'currency' => 'Euro',
                'currency_symbol' => '€',
            ],
            [
                'code' => 'DE',
                'name' => [
                    'de' => 'Deutschland',
                    'en' => 'Germany',
                ],
                'symbol' => '🇩🇪',
                'currency' => 'Euro',
                'currency_symbol' => '€',
            ],
        ];

        foreach ($countries as $country) {
            Country::query()->updateOrCreate(
                ['code' => $country['code']],
                [
                    'name' => $country['name'],
                    'symbol' => $country['symbol'],
                    'currency' => $country['currency'],
                    'currency_symbol' => $country['currency_symbol'],
                ]
            );
        }
    }
}
