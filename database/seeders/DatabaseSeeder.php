<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
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
            DeskrlImageSeeder::class,

            AvailabilitySeeder::class,
            SpecialAvailabilitySeeder::class,
            SpecialDayPriceSeeder::class,

            FavoriteSeeder::class,
            BookingSeeder::class,

            TestScenarioSeeder::class,
        ]);
    }
}
