<?php

namespace Database\Seeders;

use App\Models\Language;
use Illuminate\Database\Seeder;

class LanguageSeeder extends Seeder
{
    public function run(): void
    {
        $languages = [
            [
                'name' => 'Deutsch',
                'icon_path' => 'images/languages/de.svg',
            ],
            [
                'name' => 'Englisch',
                'icon_path' => 'images/languages/en.svg',
            ],
        ];

        foreach ($languages as $language) {
            Language::query()->updateOrCreate(
                ['name' => $language['name']],
                ['icon_path' => $language['icon_path']]
            );
        }
    }
}
