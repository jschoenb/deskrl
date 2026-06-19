<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\Address;
use App\Models\Availability;
use App\Models\CommercialAccount;
use App\Models\Deskrl;
use App\Models\DeskrlAddress;
use App\Models\DeskrlCategory;
use App\Models\Utility;
use App\Models\UtilityCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

class TestScenarioSeeder extends Seeder
{
    public function run(): void
    {
        $austriaCountryId = $this->getOrCreateAustriaCountryId();

        $coworkingCategory = $this->firstOrCreateDeskrlCategory(
            name: 'Co-Working Platz',
            maskType: 'mask_2',
        );

        $workplaceCategory = $this->firstOrCreateDeskrlCategory(
            name: 'Arbeitsplatz',
            maskType: 'mask_1',
        );

        $comfortCategory = $this->firstOrCreateUtilityCategory('Komfort & Infrastruktur');
        $technologyCategory = $this->firstOrCreateUtilityCategory('Technik');
        $mobilityCategory = $this->firstOrCreateUtilityCategory('Mobilität');
        $accessCategory = $this->firstOrCreateUtilityCategory('Zugang');

        $this->seedPrivateProviderScenario(
            austriaCountryId: $austriaCountryId,
            coworkingCategory: $coworkingCategory,
            comfortCategory: $comfortCategory,
        );

        $this->seedCommercialProviderScenario(
            austriaCountryId: $austriaCountryId,
            workplaceCategory: $workplaceCategory,
            comfortCategory: $comfortCategory,
            technologyCategory: $technologyCategory,
            mobilityCategory: $mobilityCategory,
            accessCategory: $accessCategory,
        );
    }

    /**
     * Test 1:
     * Susanne Wildner legt als private Anbieterin "Susis Coworking Loft" an.
     */
    private function seedPrivateProviderScenario(
        int $austriaCountryId,
        DeskrlCategory $coworkingCategory,
        UtilityCategory $comfortCategory,
    ): void {
        $susanne = Account::query()->updateOrCreate(
            ['email' => 'susi@gmx.at'],
            [
                'first_name' => 'Susanne',
                'last_name' => 'Wildner',
                'password' => Hash::make('Susi123'),
                'email_verified' => true,
                'account_type' => 'private_host',
                'status' => 'active',
                'gender' => 'undefined',
            ]
        );

        $address = Address::query()->updateOrCreate(
            [
                'country_id' => $austriaCountryId,
                'city' => 'Freistadt',
                'street' => 'Pfadfinderweg',
                'house_nr' => '5',
                'postal_code' => '4240',
            ],
            [
                'state' => 'Oberösterreich',
                'stair' => null,
                'door' => null,
                'latitude' => 48.5110000,
                'longitude' => 14.5045000,
            ]
        );

        $this->attachAccountAddress(
            account: $susanne,
            address: $address,
            isDefault: true,
            isBillingAddress: true,
        );

        $deskrl = $this->updateOrCreateDeskrlByGermanTitle(
            host: $susanne,
            germanTitle: 'Susis Coworking Loft',
            values: [
                'deskrl_category_id' => $coworkingCategory->id,
                'title' => [
                    'de' => 'Susis Coworking Loft',
                ],
                'description' => [
                    'de' => 'Gemütliches, warmes Loft zum Coworken.',
                ],
                'status' => 'active',
                'capacity' => 120,
                'price_per_hour' => 3.00,
                'price_per_half_day' => 20.00,
                'price_per_day' => 35.00,
                'price_per_week' => null,
                'price_per_month' => 150.00,
                'instant_bookable' => true,
                'min_hours' => null,
                'max_hours' => 100 * 24,
                'bookable_before_hours' => null,
                'bookable_until_months' => null,
            ],
        );

        DeskrlAddress::query()->updateOrCreate(
            ['deskrl_id' => $deskrl->id],
            ['address_id' => $address->id]
        );

        $this->syncUtilities($deskrl, [
            [
                'name' => 'WC',
                'category' => $comfortCategory,
                'quantity' => 1,
            ],
            [
                'name' => 'Bügeleisen',
                'category' => $comfortCategory,
                'quantity' => null,
            ],
            [
                'name' => 'Nichtraucher',
                'category' => $comfortCategory,
                'quantity' => null,
            ],
            [
                'name' => 'Küche',
                'category' => $comfortCategory,
                'quantity' => null,
            ],
        ]);

        $this->syncAvailabilities($deskrl, [
            [
                'weekday' => 'saturday',
                'start_time' => '06:00:00',
                'end_time' => '22:00:00',
            ],
            [
                'weekday' => 'sunday',
                'start_time' => '06:00:00',
                'end_time' => '22:00:00',
            ],
        ]);

        /*
         * Deine aktuelle special_availabilities-Tabelle hat keinen echten "blocked"-Status.
         * Sie speichert nur exception_date, start_time und end_time.
         * Deshalb wird der blockierte 31. Juli als 00:00–00:00-Ausnahme abgelegt.
         * Falls ihr später eine is_blocked/status-Spalte ergänzt, sollte diese Methode angepasst werden.
         */
        $this->seedSpecialAvailabilityClosedDay($deskrl, '2026-07-31');
    }

    /**
     * Test 2:
     * Christian Hummels legt als gewerblicher Anbieter "Modernes Kleinbüro" an.
     */
    private function seedCommercialProviderScenario(
        int $austriaCountryId,
        DeskrlCategory $workplaceCategory,
        UtilityCategory $comfortCategory,
        UtilityCategory $technologyCategory,
        UtilityCategory $mobilityCategory,
        UtilityCategory $accessCategory,
    ): void {
        $christian = Account::query()->updateOrCreate(
            ['email' => 'hummels@mail.com'],
            [
                'first_name' => 'Christian',
                'last_name' => 'Hummels',
                'password' => Hash::make('HummelPasswort1'),
                'email_verified' => true,
                'account_type' => 'commercial_host',
                'status' => 'active',
                'gender' => 'undefined',
            ]
        );

        CommercialAccount::query()->updateOrCreate(
            ['account_id' => $christian->id],
            [
                'company_name' => 'Hummels Office Solutions GmbH',
                'company_nr' => 'FN123456a',
                'vat_nr' => 'ATU12345678',
                'is_verified' => true,
            ]
        );

        $address = Address::query()->updateOrCreate(
            [
                'country_id' => $austriaCountryId,
                'city' => 'Hagenberg',
                'street' => 'Softwarepark',
                'house_nr' => '12',
                'postal_code' => '4232',
            ],
            [
                'state' => 'Oberösterreich',
                'stair' => null,
                'door' => null,
                'latitude' => 48.3696000,
                'longitude' => 14.5128000,
            ]
        );

        $this->attachAccountAddress(
            account: $christian,
            address: $address,
            isDefault: true,
            isBillingAddress: true,
            companyName: 'Hummels Office Solutions GmbH',
            vatNr: 'ATU12345678',
        );

        $deskrl = $this->updateOrCreateDeskrlByGermanTitle(
            host: $christian,
            germanTitle: 'Modernes Kleinbüro',
            values: [
                'deskrl_category_id' => $workplaceCategory->id,
                'title' => [
                    'de' => 'Modernes Kleinbüro',
                ],
                'description' => [
                    'de' => 'Büro für 1 oder 2 Personen mit modernster Ausstattung.',
                ],
                'status' => 'active',
                'capacity' => 2,
                'price_per_hour' => 15.00,
                'price_per_half_day' => 75.00,
                'price_per_day' => null,
                'price_per_week' => null,
                'price_per_month' => null,
                'instant_bookable' => false,
                'min_hours' => null,
                'max_hours' => 10 * 24,
                'bookable_before_hours' => null,
                'bookable_until_months' => null,
            ],
        );

        DeskrlAddress::query()->updateOrCreate(
            ['deskrl_id' => $deskrl->id],
            ['address_id' => $address->id]
        );

        $this->syncUtilities($deskrl, [
            [
                'name' => 'WLAN',
                'category' => $technologyCategory,
                'quantity' => null,
            ],
            [
                'name' => 'Drucker',
                'category' => $technologyCategory,
                'quantity' => 1,
            ],
            [
                'name' => 'Bildschirm',
                'category' => $technologyCategory,
                'quantity' => 2,
            ],
            [
                'name' => 'Tastatur/Maus',
                'category' => $technologyCategory,
                'quantity' => 2,
            ],
            [
                'name' => 'Dockingstation',
                'category' => $technologyCategory,
                'quantity' => 2,
            ],
            [
                'name' => 'Flipchart',
                'category' => $technologyCategory,
                'quantity' => 1,
            ],
            [
                'name' => 'Stromanschluss',
                'category' => $technologyCategory,
                'quantity' => 4,
            ],
            [
                'name' => 'WC',
                'category' => $comfortCategory,
                'quantity' => 1,
            ],
            [
                'name' => 'Klimaanlage',
                'category' => $comfortCategory,
                'quantity' => null,
            ],
            [
                'name' => 'Eigenständiger Check-in',
                'category' => $accessCategory,
                'quantity' => null,
            ],
            [
                'name' => 'Kostenloser Parkplatz',
                'category' => $mobilityCategory,
                'quantity' => 2,
            ],
        ]);

        $this->syncAvailabilities($deskrl, [
            [
                'weekday' => 'monday',
                'start_time' => '08:00:00',
                'end_time' => '17:00:00',
            ],
            [
                'weekday' => 'tuesday',
                'start_time' => '08:00:00',
                'end_time' => '17:00:00',
            ],
            [
                'weekday' => 'wednesday',
                'start_time' => '08:00:00',
                'end_time' => '17:00:00',
            ],
            [
                'weekday' => 'thursday',
                'start_time' => '08:00:00',
                'end_time' => '17:00:00',
            ],
            [
                'weekday' => 'friday',
                'start_time' => '08:00:00',
                'end_time' => '17:00:00',
            ],
        ]);
    }

    /**
     * Gets Austria from the countries table or creates it if it does not exist.
     */
    private function getOrCreateAustriaCountryId(): int
    {
        $countryId = DB::table('countries')
            ->where('code', 'AT')
            ->value('id');

        if ($countryId) {
            return (int) $countryId;
        }

        return (int) DB::table('countries')->insertGetId([
            'name' => json_encode([
                'de' => 'Österreich',
                'en' => 'Austria',
            ]),
            'symbol' => '🇦🇹',
            'code' => 'AT',
            'currency' => 'Euro',
            'currency_symbol' => '€',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Creates or finds a Deskrl category.
     *
     * Your migration requires:
     * - activated
     * - mask_type
     *
     * Allowed mask_type values:
     * - mask_1
     * - mask_2
     */
    private function firstOrCreateDeskrlCategory(string $name, string $maskType): DeskrlCategory
    {
        $category = DeskrlCategory::query()
            ->where('name', $name)
            ->first();

        if ($category) {
            return $category;
        }

        return DeskrlCategory::query()->create([
            'name' => $name,
            'activated' => true,
            'mask_type' => $maskType,
        ]);
    }

    /**
     * Creates or finds a utility category by German name.
     */
    private function firstOrCreateUtilityCategory(string $name): UtilityCategory
    {
        $category = UtilityCategory::query()
            ->where('category_name->de', $name)
            ->first();

        if ($category) {
            return $category;
        }

        return UtilityCategory::query()->create([
            'category_name' => [
                'de' => $name,
            ],
        ]);
    }

    /**
     * Creates or finds a utility by German name.
     */
    private function firstOrCreateUtility(string $name, UtilityCategory $category): Utility
    {
        $utility = Utility::query()
            ->where('name->de', $name)
            ->first();

        if ($utility) {
            return $utility;
        }

        return Utility::query()->create([
            'utility_category_id' => $category->id,
            'name' => [
                'de' => $name,
            ],
        ]);
    }

    /**
     * Creates or updates a Deskrl identified by host and German title.
     */
    private function updateOrCreateDeskrlByGermanTitle(
        Account $host,
        string $germanTitle,
        array $values,
    ): Deskrl {
        $deskrl = Deskrl::query()
            ->where('host_account_id', $host->id)
            ->where('title->de', $germanTitle)
            ->first();

        if (!$deskrl) {
            $deskrl = new Deskrl();
            $deskrl->host_account_id = $host->id;
        }

        $deskrl->fill($values);
        $deskrl->save();

        return $deskrl;
    }

    /**
     * Syncs utilities to a Deskrl including optional pivot quantities.
     */
    private function syncUtilities(Deskrl $deskrl, array $utilities): void
    {
        foreach ($utilities as $utilityData) {
            $utility = $this->firstOrCreateUtility(
                name: $utilityData['name'],
                category: $utilityData['category'],
            );

            $deskrl->utilities()->syncWithoutDetaching([
                $utility->id => [
                    'quantity' => $utilityData['quantity'],
                ],
            ]);
        }
    }

    /**
     * Replaces all weekly availabilities for the given Deskrl.
     */
    private function syncAvailabilities(Deskrl $deskrl, array $availabilities): void
    {
        Availability::query()
            ->where('deskrl_id', $deskrl->id)
            ->delete();

        foreach ($availabilities as $availability) {
            Availability::query()->create([
                'deskrl_id' => $deskrl->id,
                'weekday' => $availability['weekday'],
                'start_time' => $availability['start_time'],
                'end_time' => $availability['end_time'],
            ]);
        }
    }

    /**
     * Adds account-address relation if the account_addresses table exists.
     */
    private function attachAccountAddress(
        Account $account,
        Address $address,
        bool $isDefault,
        bool $isBillingAddress,
        ?string $companyName = null,
        ?string $vatNr = null,
    ): void {
        if (!Schema::hasTable('account_addresses')) {
            return;
        }

        DB::table('account_addresses')->updateOrInsert(
            [
                'account_id' => $account->id,
                'address_id' => $address->id,
            ],
            [
                'is_default' => $isDefault,
                'company_name' => $companyName,
                'vat_nr' => $vatNr,
                'is_billing_address' => $isBillingAddress,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }

    /**
     * Seeds a closed special day using the available schema.
     *
     * Current schema:
     * - exception_date
     * - start_time
     * - end_time
     *
     * There is currently no dedicated "blocked" column.
     */
    private function seedSpecialAvailabilityClosedDay(Deskrl $deskrl, string $date): void
    {
        if (!Schema::hasTable('special_availabilities')) {
            return;
        }

        DB::table('special_availabilities')->updateOrInsert(
            [
                'deskrl_id' => $deskrl->id,
                'exception_date' => $date,
            ],
            [
                'start_time' => '00:00:00',
                'end_time' => '00:00:00',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }
}
