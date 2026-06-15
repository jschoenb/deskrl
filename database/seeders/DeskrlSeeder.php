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
        $fallbackCategory = DeskrlCategory::query()->first();

        if (!$hostAccount) {
            $this->command->warn('No account found. Please seed accounts before deskrls.');
            return;
        }

        if (!$fallbackCategory) {
            $this->command->warn('No deskrl category found. Please seed deskrl categories before deskrls.');
            return;
        }

        $workspaceCategory = $this->findCategoryOrFallback('Arbeitsplatz', $fallbackCategory);
        $officeCategory = $this->findCategoryOrFallback('Büroraum', $fallbackCategory);
        $seminarRoomCategory = $this->findCategoryOrFallback('Seminarraum', $fallbackCategory);
        $eventLocationCategory = $this->findCategoryOrFallback('Eventlocation', $fallbackCategory);

        Deskrl::query()->updateOrCreate(
            [
                'host_account_id' => $hostAccount->id,
                'title->de' => 'Moderner Meetingraum in Linz',
            ],
            [
                'deskrl_category_id' => $officeCategory->id,
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
                'max_hours' => 760,
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
                'max_hours' => 800,
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
                'deskrl_category_id' => $seminarRoomCategory->id,
                'title' => [
                    'de' => 'Seminarraum für Workshops',
                ],
                'description' => [
                    'de' => 'Großer Seminarraum mit flexibler Bestuhlung, Beamer und Flipchart.',
                ],
                'status' => 'active',
                'capacity' => 20,
                'price_per_hour' => 45.00,
                'price_per_half_day' => 160.00,
                'price_per_day' => 290.00,
                'price_per_week' => 1200.00,
                'price_per_month' => 4200.00,
                'instant_bookable' => false,
                'min_hours' => 4,
                'max_hours' => 1000,
                'bookable_before_hours' => 48,
                'bookable_until_months' => 12,
            ]
        );

        Deskrl::query()->updateOrCreate(
            [
                'host_account_id' => $hostAccount->id,
                'title->de' => 'Kreativer Projektraum in Graz',
            ],
            [
                'deskrl_category_id' => $officeCategory->id,
                'title' => [
                    'de' => 'Kreativer Projektraum in Graz',
                ],
                'description' => [
                    'de' => 'Moderner Raum für Projektarbeit, Brainstormings und Teammeetings mit Whiteboard und großem Bildschirm.',
                ],
                'status' => 'active',
                'capacity' => 6,
                'price_per_hour' => 22.00,
                'price_per_half_day' => 80.00,
                'price_per_day' => 145.00,
                'price_per_week' => 620.00,
                'price_per_month' => 2100.00,
                'instant_bookable' => true,
                'min_hours' => 2,
                'max_hours' => 812,
                'bookable_before_hours' => 24,
                'bookable_until_months' => 6,
            ]
        );

        Deskrl::query()->updateOrCreate(
            [
                'host_account_id' => $hostAccount->id,
                'title->de' => 'Ruhiges Einzelbüro in Salzburg',
            ],
            [
                'deskrl_category_id' => $officeCategory->id,
                'title' => [
                    'de' => 'Ruhiges Einzelbüro in Salzburg',
                ],
                'description' => [
                    'de' => 'Abgeschlossenes Einzelbüro für konzentriertes Arbeiten mit Schreibtisch, WLAN und Stauraum.',
                ],
                'status' => 'active',
                'capacity' => 1,
                'price_per_hour' => 18.00,
                'price_per_half_day' => 60.00,
                'price_per_day' => 105.00,
                'price_per_week' => 450.00,
                'price_per_month' => 1500.00,
                'instant_bookable' => true,
                'min_hours' => 1,
                'max_hours' => 833,
                'bookable_before_hours' => 12,
                'bookable_until_months' => 4,
            ]
        );

        Deskrl::query()->updateOrCreate(
            [
                'host_account_id' => $hostAccount->id,
                'title->de' => 'Eventraum für kleine Gruppen',
            ],
            [
                'deskrl_category_id' => $eventLocationCategory->id,
                'title' => [
                    'de' => 'Eventraum für kleine Gruppen',
                ],
                'description' => [
                    'de' => 'Flexibel nutzbarer Raum für kleine Events, Präsentationen oder Networking-Abende mit Sitzmöglichkeiten und Technik.',
                ],
                'status' => 'active',
                'capacity' => 15,
                'price_per_hour' => 38.00,
                'price_per_half_day' => 135.00,
                'price_per_day' => 240.00,
                'price_per_week' => 980.00,
                'price_per_month' => 3600.00,
                'instant_bookable' => false,
                'min_hours' => 3,
                'max_hours' => 1244,
                'bookable_before_hours' => 48,
                'bookable_until_months' => 9,
            ]
        );
    }

    /**
     * Finds a category by name or returns the fallback category.
     */
    private function findCategoryOrFallback(string $name, DeskrlCategory $fallbackCategory): DeskrlCategory
    {
        $category = DeskrlCategory::query()
            ->where('name', $name)
            ->first();

        if ($category) {
            return $category;
        }

        $this->command->warn("No DeskrlCategory found for {$name}. Using fallback category.");

        return $fallbackCategory;
    }
}
