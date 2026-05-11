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

        foreach ($deskrls as $deskrl) {
            $images = [
                [
                    'path' => 'images/deskrls/deskrl-' . $deskrl->id . '-main.jpg',
                    'is_main' => true,
                    'sort_order' => 1,
                ],
                [
                    'path' => 'images/deskrls/deskrl-' . $deskrl->id . '-detail-1.jpg',
                    'is_main' => false,
                    'sort_order' => 2,
                ],
                [
                    'path' => 'images/deskrls/deskrl-' . $deskrl->id . '-detail-2.jpg',
                    'is_main' => false,
                    'sort_order' => 3,
                ],
            ];

            foreach ($images as $image) {
                DeskrlImage::query()->updateOrCreate(
                    [
                        'deskrl_id' => $deskrl->id,
                        'path' => $image['path'],
                    ],
                    [
                        'is_main' => $image['is_main'],
                        'sort_order' => $image['sort_order'],
                    ]
                );
            }
        }
    }
}
