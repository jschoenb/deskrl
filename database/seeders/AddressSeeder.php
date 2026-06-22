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
                'latitude' => 48.3069000,
                'longitude' => 14.2858000,
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
                'latitude' => 48.2160000,
                'longitude' => 16.3910000,
            ],
            [
                'country_id' => $austria->id,
                'state' => 'Oberösterreich',
                'city' => 'Hagenberg',
                'street' => 'Softwarepark',
                'house_nr' => '12',
                'postal_code' => '4232',
                'stair' => null,
                'door' => null,
                'latitude' => 48.3696000,
                'longitude' => 14.5128000,
            ],
            [
                'country_id' => $austria->id,
                'state' => 'Steiermark',
                'city' => 'Graz',
                'street' => 'Annenstraße',
                'house_nr' => '23',
                'postal_code' => '8020',
                'stair' => null,
                'door' => null,
                'latitude' => 47.0707000,
                'longitude' => 15.4310000,
            ],
            [
                'country_id' => $austria->id,
                'state' => 'Salzburg',
                'city' => 'Salzburg',
                'street' => 'Elisabethstraße',
                'house_nr' => '1',
                'postal_code' => '5020',
                'stair' => null,
                'door' => null,
                'latitude' => 47.8120000,
                'longitude' => 13.0440000,
            ],
            [
                'country_id' => $austria->id,
                'state' => 'Oberösterreich',
                'city' => 'Linz',
                'street' => 'Peter-Behrens-Platz',
                'house_nr' => '1',
                'postal_code' => '4020',
                'stair' => null,
                'door' => null,
                'latitude' => 48.3117000,
                'longitude' => 14.3020000,
            ],
        ];

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
                    'latitude' => $address['latitude'],
                    'longitude' => $address['longitude'],
                ]
            );
        }
    }
}
