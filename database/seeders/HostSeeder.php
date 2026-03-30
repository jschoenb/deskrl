<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Host;
use App\Models\Listing;


class HostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sophie = User::where('email', 'sophie@deskrl.test')->first();
        $daniel = User::where('email', 'daniel@deskrl.test')->first();
        $lea = User::where('email', 'lea@deskrl.test')->first();

        Host::create([
            'user_id' => $sophie->id,
            'first_name' => 'Sophie',
            'last_name' => 'Berger',
            'is_company' => true,
            'company_name' => 'Urban Spaces GmbH',
            'company_nr' => 'FN123456a',
            'vat_nr' => 'ATU12345678',
            'is_verified' => true,
        ]);

        Host::create([
            'user_id' => $daniel->id,
            'first_name' => 'Daniel',
            'last_name' => 'Hofer',
            'is_company' => true,
            'company_name' => 'WorkHub Flex GmbH',
            'company_nr' => 'FN234567b',
            'vat_nr' => 'ATU23456789',
            'is_verified' => true,
        ]);

        Host::create([
            'user_id' => $lea->id,
            'first_name' => 'Lea',
            'last_name' => 'Mayer',
            'is_company' => false,
            'company_name' => null,
            'company_nr' => null,
            'vat_nr' => null,
            'is_verified' => false,
        ]);
    }
}
