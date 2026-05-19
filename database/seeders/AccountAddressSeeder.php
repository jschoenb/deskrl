<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\AccountAddress;
use App\Models\Address;
use Illuminate\Database\Seeder;

class AccountAddressSeeder extends Seeder
{
    public function run(): void
    {
        $accounts = Account::query()->get();
        $addresses = Address::query()->get();

        if ($accounts->isEmpty()) {
            $this->command->warn('No accounts found. Please seed accounts before account addresses.');
            return;
        }

        if ($addresses->isEmpty()) {
            $this->command->warn('No addresses found. Please seed addresses before account addresses.');
            return;
        }

        foreach ($accounts as $index => $account) {
            $address = $addresses[$index % $addresses->count()];

            AccountAddress::query()->updateOrCreate(
                [
                    'account_id' => $account->id,
                    'address_id' => $address->id,
                ],
                [
                    'is_default' => true,
                    'company_name' => $account->account_type === 'commercial_host'
                        ? 'Deskrl Business Spaces GmbH'
                        : null,
                    'vat_nr' => $account->account_type === 'commercial_host'
                        ? 'ATU12345678'
                        : null,
                    'is_billing_address' => true,
                ]
            );
        }
    }
}
