<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Listing;
use App\Models\Address;

class AddressSeeder extends Seeder
{
    public function run(): void
    {
        $meetingraum = Listing::where('title', 'Moderner Meetingraum Wien Zentrum')->first();
        $seminarraum = Listing::where('title', 'Seminarraum mit Präsentationstechnik')->first();
        $coworking = Listing::where('title', 'Coworking Platz im Open Space')->first();
        $buero = Listing::where('title', 'Privates Büro für konzentriertes Arbeiten')->first();
        $arbeitsplatz = Listing::where('title', 'Kleiner Arbeitsplatz mit Tageslicht')->first();
        $event = Listing::where('title', 'Eventfläche für kleine Business Events')->first();

        Address::create([
            'listing_id' => $meetingraum->id,
            'country' => 'Austria',
            'city' => 'Wien',
            'street' => 'Mariahilfer Straße',
            'house_number' => '12',
            'postal_code' => '1060',
        ]);

        Address::create([
            'listing_id' => $seminarraum->id,
            'country' => 'Austria',
            'city' => 'Wien',
            'street' => 'Neubaugasse',
            'house_number' => '45',
            'postal_code' => '1070',
        ]);

        Address::create([
            'listing_id' => $coworking->id,
            'country' => 'Austria',
            'city' => 'Linz',
            'street' => 'Landstraße',
            'house_number' => '99',
            'postal_code' => '4020',
        ]);

        Address::create([
            'listing_id' => $buero->id,
            'country' => 'Austria',
            'city' => 'Linz',
            'street' => 'Hauptplatz',
            'house_number' => '5',
            'postal_code' => '4020',
        ]);

        Address::create([
            'listing_id' => $arbeitsplatz->id,
            'country' => 'Austria',
            'city' => 'Salzburg',
            'street' => 'Getreidegasse',
            'house_number' => '22',
            'postal_code' => '5020',
        ]);

        Address::create([
            'listing_id' => $event->id,
            'country' => 'Austria',
            'city' => 'Salzburg',
            'street' => 'Mirabellplatz',
            'house_number' => '1',
            'postal_code' => '5020',
        ]);
    }
}
