<?php

namespace Database\Seeders;

use App\Models\UtilityCategory;
use Illuminate\Database\Seeder;

class UtilityCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'category_name' => [
                    'de' => 'Technik & Arbeitsausstattung',
                    'en' => 'Technology & work equipment',
                ],
            ],
            [
                'category_name' => [
                    'de' => 'Komfort & Infrastruktur',
                    'en' => 'Comfort & infrastructure',
                ],
            ],
            [
                'category_name' => [
                    'de' => 'Mobilität & Lage',
                    'en' => 'Mobility & location',
                ],
            ],
            [
                'category_name' => [
                    'de' => 'Extras & Freizeit',
                    'en' => 'Extras & leisure',
                ],
            ],
        ];

        foreach ($categories as $category) {
            UtilityCategory::query()->updateOrCreate(
                ['category_name->de' => $category['category_name']['de']],
                ['category_name' => $category['category_name']]
            );
        }
    }
}
