<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\Deskrl;
use App\Models\DeskrlAddress;
use Illuminate\Database\Seeder;

class DeskrlAddressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $assignments = [
            [
                'deskrl_title' => 'Moderner Meetingraum in Linz',
                'city' => 'Linz',
                'street' => 'Hauptstraße',
                'house_nr' => '12',
                'postal_code' => '4020',
            ],
            [
                'deskrl_title' => 'Flexibler Arbeitsplatz in Wien',
                'city' => 'Wien',
                'street' => 'Praterstraße',
                'house_nr' => '25',
                'postal_code' => '1020',
            ],
            [
                'deskrl_title' => 'Seminarraum für Workshops',
                'city' => 'Hagenberg',
                'street' => 'Softwarepark',
                'house_nr' => '12',
                'postal_code' => '4232',
            ],
            [
                'deskrl_title' => 'Kreativer Projektraum in Graz',
                'city' => 'Graz',
                'street' => 'Annenstraße',
                'house_nr' => '23',
                'postal_code' => '8020',
            ],
            [
                'deskrl_title' => 'Ruhiges Einzelbüro in Salzburg',
                'city' => 'Salzburg',
                'street' => 'Elisabethstraße',
                'house_nr' => '1',
                'postal_code' => '5020',
            ],
            [
                'deskrl_title' => 'Eventraum für kleine Gruppen',
                'city' => 'Linz',
                'street' => 'Peter-Behrens-Platz',
                'house_nr' => '1',
                'postal_code' => '4020',
            ],
        ];

        foreach ($assignments as $assignment) {
            // Find the seeded Deskrl by its German title.
            $deskrl = Deskrl::query()
                ->where('title->de', $assignment['deskrl_title'])
                ->first();

            if (!$deskrl) {
                $this->command->warn("No Deskrl found for {$assignment['deskrl_title']}.");
                continue;
            }

            // Find the matching seeded address.
            $address = Address::query()
                ->where('city', $assignment['city'])
                ->where('street', $assignment['street'])
                ->where('house_nr', $assignment['house_nr'])
                ->where('postal_code', $assignment['postal_code'])
                ->first();

            if (!$address) {
                $this->command->warn(
                    "No address found for {$assignment['street']} {$assignment['house_nr']}, {$assignment['postal_code']} {$assignment['city']}."
                );
                continue;
            }

            // Create or update the address relation for the Deskrl.
            DeskrlAddress::query()->updateOrCreate(
                [
                    'deskrl_id' => $deskrl->id,
                ],
                [
                    'address_id' => $address->id,
                ]
            );
        }
    }
}
