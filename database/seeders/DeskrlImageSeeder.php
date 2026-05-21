<?php

namespace Database\Seeders;

use App\Models\Deskrl;
use App\Models\DeskrlImage;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DeskrlImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Deskrl images need existing Deskrls.
        $deskrls = Deskrl::query()->get();

        if ($deskrls->isEmpty()) {
            $this->command->warn('No deskrls found. Please seed deskrls before deskrl images.');
            return;
        }

        // External image URLs are used for the MVP so no local image files are required.
        $imageSets = [
            [
                'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
                'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=80',
                'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80',
            ],
            [
                'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=1200&q=80',
                'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80',
                'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=1200&q=80',
            ],
            [
                'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80',
                'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80',
                'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&q=80',
            ],
        ];

        foreach ($deskrls as $index => $deskrl) {
            // Reuse image sets if there are more Deskrls than image sets.
            $selectedImages = $imageSets[$index % count($imageSets)];

            foreach ($selectedImages as $imageIndex => $imageUrl) {
                DeskrlImage::query()->updateOrCreate(
                    [
                        'deskrl_id' => $deskrl->id,
                        'path' => $imageUrl,
                    ],
                    [
                        'is_main' => $imageIndex === 0,
                        'sort_order' => $imageIndex + 1,
                    ]
                );
            }
        }
    }
}
