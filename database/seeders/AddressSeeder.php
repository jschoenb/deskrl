<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\Country;
use Illuminate\Database\Seeder;

class AddressSeeder extends Seeder
{
    public function run(): void
    {
        $austria = Country::query()->where('code', 'AT')->first();
        $germany = Country::query()->where('code', 'DE')->first();

        if (!$austria) {
            $this->command->warn('No country AT found. Please seed countries before addresses.');
            return;
        }

        $addresses = [
            [
                'country_id' => $austria->id,
                'state' => 'Oberösterreich',
                'city' => 'Linz',
                'street' => 'Hauptstraße',
                'house_nr' => '12',
                'postal_code' => '4020',
                'stair' => null,
                'door' => '5',
            ],
            [
                'country_id' => $austria->id,
                'state' => 'Wien',
                'city' => 'Wien',
                'street' => 'Praterstraße',
                'house_nr' => '25',
                'postal_code' => '1020',
                'stair' => '2',
                'door' => '14',
            ],
            [
                'country_id' => $austria->id,
                'state' => 'Oberösterreich',
                'city' => 'Hagenberg',
                'street' => 'Softwarepark',
                'house_nr' => '1',
                'postal_code' => '4232',
                'stair' => null,
                'door' => null,
            ],
        ];

        if ($germany) {
            $addresses[] = [
                'country_id' => $germany->id,
                'state' => 'Bayern',
                'city' => 'München',
                'street' => 'Leopoldstraße',
                'house_nr' => '50',
                'postal_code' => '80802',
                'stair' => null,
                'door' => null,
            ];
        }

        foreach ($addresses as $address) {
            Address::query()->updateOrCreate(
                [
                    'country_id' => $address['country_id'],
                    'city' => $address['city'],
                    'street' => $address['street'],
                    'house_nr' => $address['house_nr'],
                    'postal_code' => $address['postal_code'],
                ],
                [
                    'state' => $address['state'],
                    'stair' => $address['stair'],
                    'door' => $address['door'],
                ]
            );
        }
    }
}
