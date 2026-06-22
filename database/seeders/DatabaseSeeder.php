<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->call([
            LanguageSeeder::class,
            CountrySeeder::class,

            DeskrlCategorySeeder::class,
            UtilityCategorySeeder::class,
            UtilitySeeder::class,

            AccountSeeder::class,
            CommercialAccountSeeder::class,
            AccountLanguageSeeder::class,

            AddressSeeder::class,
            AccountAddressSeeder::class,

            DeskrlSeeder::class,
            DeskrlAddressSeeder::class,
            DeskrlUtilitySeeder::class,

            AvailabilitySeeder::class,
            SpecialAvailabilitySeeder::class,
            SpecialDayPriceSeeder::class,

            // Creates additional test accounts, addresses, Deskrls, utilities and availabilities.
            // This must run before DeskrlImageSeeder so the test Deskrls also receive images.
            TestScenarioSeeder::class,

            // Must run after all Deskrls exist.
            DeskrlImageSeeder::class,

            FavoriteSeeder::class,
            BookingSeeder::class,
        ]);
    }
}