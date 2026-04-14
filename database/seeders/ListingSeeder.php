<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Host;
use App\Models\Listing;
use App\Models\Utility;

class ListingSeeder extends Seeder
{
    public function run(): void
    {
        $sophieHost = Host::where('first_name', 'Sophie')->where('last_name', 'Berger')->first();
        $danielHost = Host::where('first_name', 'Daniel')->where('last_name', 'Hofer')->first();
        $leaHost = Host::where('first_name', 'Lea')->where('last_name', 'Mayer')->first();

        $meetingraum = Listing::create([
            'host_id' => $sophieHost->id,
            'title' => 'Moderner Meetingraum Wien Zentrum',
            'description' => 'Heller Besprechungsraum für Teams und Kundentermine in zentraler Lage.',
            'type' => 'office',
            'status' => 'active',
            'capacity' => 8,
            'price_per_hour' => 2500,
            'price_per_half_day' => 9000,
            'price_per_day' => 16000,
            'price_per_week' => 70000,
            'price_per_month' => 240000,
        ]);

        $seminarraum = Listing::create([
            'host_id' => $sophieHost->id,
            'title' => 'Seminarraum mit Präsentationstechnik',
            'description' => 'Großer Seminarraum für Workshops, Schulungen und Teamtage.',
            'type' => 'seminar',
            'status' => 'active',
            'capacity' => 20,
            'price_per_hour' => 4000,
            'price_per_half_day' => 14000,
            'price_per_day' => 26000,
            'price_per_week' => 110000,
            'price_per_month' => 380000,
        ]);

        $coworkingPlatz = Listing::create([
            'host_id' => $danielHost->id,
            'title' => 'Coworking Platz im Open Space',
            'description' => 'Flexibler Arbeitsplatz mit WLAN, Kaffee und guter Verkehrsanbindung.',
            'type' => 'coworking',
            'status' => 'active',
            'capacity' => 1,
            'price_per_hour' => 800,
            'price_per_half_day' => 2500,
            'price_per_day' => 3900,
            'price_per_week' => 17000,
            'price_per_month' => 52000,
        ]);

        $privatesBuero = Listing::create([
            'host_id' => $danielHost->id,
            'title' => 'Privates Büro für konzentriertes Arbeiten',
            'description' => 'Ruhiges Büro für Einzelpersonen oder kleine Teams mit hoher Privatsphäre.',
            'type' => 'workspace',
            'status' => 'inactive',
            'capacity' => 3,
            'price_per_hour' => 1800,
            'price_per_half_day' => 6000,
            'price_per_day' => 11000,
            'price_per_week' => 48000,
            'price_per_month' => 165000,
        ]);

        $arbeitsplatz = Listing::create([
            'host_id' => $leaHost->id,
            'title' => 'Kleiner Arbeitsplatz mit Tageslicht',
            'description' => 'Gemütlicher Arbeitsplatz in ruhiger Umgebung für Freelancer und Remote Work.',
            'type' => 'workspace',
            'status' => 'draft',
            'capacity' => 1,
            'price_per_hour' => 1000,
            'price_per_half_day' => 3200,
            'price_per_day' => 5500,
            'price_per_week' => 24000,
            'price_per_month' => 78000,
        ]);

        $eventflaeche = Listing::create([
            'host_id' => $leaHost->id,
            'title' => 'Eventfläche für kleine Business Events',
            'description' => 'Flexible Fläche für Networking, Vorträge und kleine Firmenveranstaltungen.',
            'type' => 'event',
            'status' => 'archived',
            'capacity' => 30,
            'price_per_hour' => 5000,
            'price_per_half_day' => 18000,
            'price_per_day' => 32000,
            'price_per_week' => 140000,
            'price_per_month' => 490000,
        ]);

        $meetingraum->utilities()->attach(
            Utility::whereIn('name', ['WLAN', 'Beamer', 'Whiteboard', 'Kaffeemaschine'])->pluck('id')
        );

        $seminarraum->utilities()->attach(
            Utility::whereIn('name', ['WLAN', 'Beamer', 'Whiteboard', 'Flipchart', 'Klimaanlage'])->pluck('id')
        );

        $coworkingPlatz->utilities()->attach(
            Utility::whereIn('name', ['WLAN', 'Kaffeemaschine', 'Drucker'])->pluck('id')
        );

        $privatesBuero->utilities()->attach(
            Utility::whereIn('name', ['WLAN', 'Klimaanlage', 'Drucker'])->pluck('id')
        );

        $arbeitsplatz->utilities()->attach(
            Utility::whereIn('name', ['WLAN', 'Kaffeemaschine'])->pluck('id')
        );

        $eventflaeche->utilities()->attach(
            Utility::whereIn('name', ['WLAN', 'Beamer', 'Whiteboard', 'Küche', 'Parkplatz', 'Barrierefrei'])->pluck('id')
        );
    }
}
