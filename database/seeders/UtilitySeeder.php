<?php

namespace Database\Seeders;

use App\Models\Utility;
use App\Models\UtilityCategory;
use Illuminate\Database\Seeder;

class UtilitySeeder extends Seeder
{
    public function run(): void
    {
        $technology = UtilityCategory::query()
            ->where('category_name->de', 'Technik & Arbeitsausstattung')
            ->first();

        $comfort = UtilityCategory::query()
            ->where('category_name->de', 'Komfort & Infrastruktur')
            ->first();

        $mobility = UtilityCategory::query()
            ->where('category_name->de', 'Mobilität & Lage')
            ->first();

        $extras = UtilityCategory::query()
            ->where('category_name->de', 'Extras & Freizeit')
            ->first();

        if (!$technology || !$comfort || !$mobility || !$extras) {
            $this->command->warn('Utility categories are missing. Please seed utility categories before utilities.');
            return;
        }

        $utilities = [
            [$technology->id, ['de' => 'WLAN', 'en' => 'WiFi']],
            [$technology->id, ['de' => 'Beamer', 'en' => 'Projector']],
            [$technology->id, ['de' => 'Bildschirm', 'en' => 'Screen']],
            [$technology->id, ['de' => 'Drucker', 'en' => 'Printer']],
            [$technology->id, ['de' => 'Flipchart', 'en' => 'Flipchart']],

            [$comfort->id, ['de' => 'Küche', 'en' => 'Kitchen']],
            [$comfort->id, ['de' => 'WC', 'en' => 'Restroom']],
            [$comfort->id, ['de' => 'Klimaanlage', 'en' => 'Air conditioning']],
            [$comfort->id, ['de' => 'Kaffeemaschine', 'en' => 'Coffee machine']],
            [$comfort->id, ['de' => 'Barrierefrei', 'en' => 'Barrier-free']],

            [$mobility->id, ['de' => 'Kostenloser Parkplatz', 'en' => 'Free parking']],
            [$mobility->id, ['de' => 'Kostenpflichtiger Parkplatz', 'en' => 'Paid parking']],
            [$mobility->id, ['de' => 'Ladestation Bike / Auto', 'en' => 'Bike / car charging station']],

            [$extras->id, ['de' => 'Catering extra buchbar', 'en' => 'Catering bookable as extra']],
            [$extras->id, ['de' => 'Garten', 'en' => 'Garden']],
            [$extras->id, ['de' => 'Terrasse', 'en' => 'Terrace']],
        ];

        foreach ($utilities as [$categoryId, $name]) {
            Utility::query()->updateOrCreate(
                ['name->de' => $name['de']],
                [
                    'utility_category_id' => $categoryId,
                    'name' => $name,
                ]
            );
        }
    }
}
