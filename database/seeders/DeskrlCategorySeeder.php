<?php

namespace Database\Seeders;

use App\Models\ListingCategory;
use Illuminate\Database\Seeder;

class DeskrlCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Arbeitsplatz',
                'activated' => true,
                'mask_type' => 'mask_1',
            ],
            [
                'name' => 'Büroraum',
                'activated' => true,
                'mask_type' => 'mask_1',
            ],
            [
                'name' => 'Coworking-Platz',
                'activated' => true,
                'mask_type' => 'mask_1',
            ],
            [
                'name' => 'Seminarraum',
                'activated' => true,
                'mask_type' => 'mask_2',
            ],
            [
                'name' => 'Eventlocation',
                'activated' => true,
                'mask_type' => 'mask_2',
            ],
        ];

        foreach ($categories as $category) {
            ListingCategory::query()->updateOrCreate(
                ['name' => $category['name']],
                [
                    'activated' => $category['activated'],
                    'mask_type' => $category['mask_type'],
                ]
            );
        }
    }
}
