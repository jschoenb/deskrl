<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\CommercialAccount;
use Illuminate\Database\Seeder;

class CommercialAccountSeeder extends Seeder
{
    public function run(): void
    {
        $commercialAccount = Account::query()
            ->where('email', 'julia@deskrl-business.at')
            ->first();

        if (!$commercialAccount) {
            $this->command->warn('No commercial account found. Please seed accounts before commercial accounts.');
            return;
        }

        CommercialAccount::query()->updateOrCreate(
            [
                'account_id' => $commercialAccount->id,
            ],
            [
                'company_name' => 'Deskrl Business Spaces GmbH',
                'company_nr' => 'FN123456a',
                'vat_nr' => 'ATU12345678',
                'is_verified' => true,
            ]
        );
    }
}
