<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\Deskrl;
use App\Models\DeskrlCategory;
use Illuminate\Database\Seeder;

class DeskrlSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * At least one account and one DeskrlCategory must exist before this seeder runs.
     */
    public function run(): void
    {
        $hostAccount = Account::query()->first();
        $workspaceCategory = DeskrlCategory::query()->first();

        if (!$hostAccount) {
            $this->command->warn('No account found. Please seed accounts before deskrls.');
            return;
        }

        if (!$workspaceCategory) {
            $this->command->warn('No deskrl category found. Please seed deskrl categories before deskrls.');
            return;
        }

        Deskrl::query()->updateOrCreate(
            [
                'host_account_id' => $hostAccount->id,
                'title->de' => 'Moderner Meetingraum in Linz',
            ],
            [
                'deskrl_category_id' => $workspaceCategory->id,
                'title' => [
                    'de' => 'Moderner Meetingraum in Linz',
                ],
                'description' => [
                    'de' => 'Heller Meetingraum mit WLAN, Bildschirm und Platz für kleinere Teams.',
                ],
                'status' => 'active',
                'capacity' => 8,
                'price_per_hour' => 25.00,
                'price_per_half_day' => 90.00,
                'price_per_day' => 160.00,
                'price_per_week' => 700.00,
                'price_per_month' => 2500.00,
                'instant_bookable' => true,
                'min_hours' => 1,
                'max_hours' => 8,
                'bookable_before_hours' => 24,
                'bookable_until_months' => 6,
            ]
        );

        Deskrl::query()->updateOrCreate(
            [
                'host_account_id' => $hostAccount->id,
                'title->de' => 'Flexibler Arbeitsplatz in Wien',
            ],
            [
                'deskrl_category_id' => $workspaceCategory->id,
                'title' => [
                    'de' => 'Flexibler Arbeitsplatz in Wien',
                ],
                'description' => [
                    'de' => 'Ruhiger Arbeitsplatz mit WLAN, Steckdosen und Zugang zu Gemeinschaftsbereichen.',
                ],
                'status' => 'active',
                'capacity' => 1,
                'price_per_hour' => 12.00,
                'price_per_half_day' => 40.00,
                'price_per_day' => 70.00,
                'price_per_week' => 300.00,
                'price_per_month' => 950.00,
                'instant_bookable' => false,
                'min_hours' => 2,
                'max_hours' => 8,
                'bookable_before_hours' => 12,
                'bookable_until_months' => 3,
            ]
        );

        Deskrl::query()->updateOrCreate(
            [
                'host_account_id' => $hostAccount->id,
                'title->de' => 'Seminarraum für Workshops',
            ],
            [
                'deskrl_category_id' => $workspaceCategory->id,
                'title' => [
                    'de' => 'Seminarraum für Workshops',
                ],
                'description' => [
                    'de' => 'Großer Seminarraum mit flexibler Bestuhlung, Beamer und Flipchart.',
                ],
                'status' => 'draft',
                'capacity' => 20,
                'price_per_hour' => 45.00,
                'price_per_half_day' => 160.00,
                'price_per_day' => 290.00,
                'price_per_week' => 1200.00,
                'price_per_month' => 4200.00,
                'instant_bookable' => false,
                'min_hours' => 4,
                'max_hours' => 10,
                'bookable_before_hours' => 48,
                'bookable_until_months' => 12,
            ]
        );
    }
}
