<?php

namespace Database\Seeders;

use App\Models\Deskrl;
use App\Models\DeskrlUtility;
use App\Models\Utility;
use Illuminate\Database\Seeder;

class DeskrlUtilitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Pivot table need existing Deskrls and existing utilities.
        $deskrls = Deskrl::query()->get();
        $utilities = Utility::query()->get();

        if ($deskrls->isEmpty() || $utilities->isEmpty()) {
            $this->command->warn('Deskrls or utilities are missing. Please seed them first.');

            return;
        }

        foreach ($deskrls as $deskrl) {
            foreach ($utilities->take(4) as $utility) {
                DeskrlUtility::query()->updateOrCreate(
                    [
                        'deskrl_id' => $deskrl->id,
                        'utility_id' => $utility->id,
                    ],
                    [
                        'quantity' => null,
                    ]
                );
            }
        }
    }
}
