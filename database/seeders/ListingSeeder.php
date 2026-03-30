<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Host;
use App\Models\Listing;



class ListingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sophieHost = Host::where('first_name', 'Sophie')->where('last_name', 'Berger')->first();
        $danielHost = Host::where('first_name', 'Daniel')->where('last_name', 'Hofer')->first();
        $leaHost = Host::where('first_name', 'Lea')->where('last_name', 'Mayer')->first();

        Listing::create([
            'host_id' => $sophieHost->id,
            'title' => 'Moderner Meetingraum Wien Zentrum',
            'description' => 'Heller Besprechungsraum für Teams und Kundentermine in zentraler Lage.',
            'type' => 'office',
            'status' => 'active',
            'capacity' => 8,
            'price_hourly' => 25,
            'price_half_day' => 90,
            'price_per_day' => 160,
            'price_per_week' => 700,
            'price_per_month' => 2400,
        ]);

        Listing::create([
            'host_id' => $sophieHost->id,
            'title' => 'Seminarraum mit Präsentationstechnik',
            'description' => 'Großer Seminarraum für Workshops, Schulungen und Teamtage.',
            'type' => 'seminar',
            'status' => 'active',
            'capacity' => 20,
            'price_hourly' => 40,
            'price_half_day' => 140,
            'price_per_day' => 260,
            'price_per_week' => 1100,
            'price_per_month' => 3800,
        ]);

        Listing::create([
            'host_id' => $danielHost->id,
            'title' => 'Coworking Platz im Open Space',
            'description' => 'Flexibler Arbeitsplatz mit WLAN, Kaffee und guter Verkehrsanbindung.',
            'type' => 'coworking',
            'status' => 'active',
            'capacity' => 1,
            'price_hourly' => 8,
            'price_half_day' => 25,
            'price_per_day' => 39,
            'price_per_week' => 170,
            'price_per_month' => 520,
        ]);

        Listing::create([
            'host_id' => $danielHost->id,
            'title' => 'Privates Büro für konzentriertes Arbeiten',
            'description' => 'Ruhiges Büro für Einzelpersonen oder kleine Teams mit hoher Privatsphäre.',
            'type' => 'workspace',
            'status' => 'inactive',
            'capacity' => 3,
            'price_hourly' => 18,
            'price_half_day' => 60,
            'price_per_day' => 110,
            'price_per_week' => 480,
            'price_per_month' => 1650,
        ]);

        Listing::create([
            'host_id' => $leaHost->id,
            'title' => 'Kleiner Arbeitsplatz mit Tageslicht',
            'description' => 'Gemütlicher Arbeitsplatz in ruhiger Umgebung für Freelancer und Remote Work.',
            'type' => 'workspace',
            'status' => 'draft',
            'capacity' => 1,
            'price_hourly' => 10,
            'price_half_day' => 32,
            'price_per_day' => 55,
            'price_per_week' => 240,
            'price_per_month' => 780,
        ]);

        Listing::create([
            'host_id' => $leaHost->id,
            'title' => 'Eventfläche für kleine Business Events',
            'description' => 'Flexible Fläche für Networking, Vorträge und kleine Firmenveranstaltungen.',
            'type' => 'event',
            'status' => 'archived',
            'capacity' => 30,
            'price_hourly' => 50,
            'price_half_day' => 180,
            'price_per_day' => 320,
            'price_per_week' => 1400,
            'price_per_month' => 4900,
        ]);
    }
}
