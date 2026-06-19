<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\AccountAddress;
use App\Models\Address;
use Illuminate\Database\Seeder;

class AccountAddressSeeder extends Seeder
{
    /**
     * Seed private and billing address relations for existing accounts.
     */
    public function run(): void
    {
        $accounts = Account::query()->get();
        $addresses = Address::query()->get();

        if ($accounts->isEmpty()) {
            $this->command->warn('No accounts found. Please seed accounts before account addresses.');
            return;
        }

        if ($addresses->count() < 2) {
            $this->command->warn('At least two addresses are needed to create separate private and billing addresses.');
            return;
        }

        foreach ($accounts as $index => $account) {
            $privateAddress = $addresses[$index % $addresses->count()];
            $billingAddress = $addresses[($index + 1) % $addresses->count()];

            if ($privateAddress->id === $billingAddress->id) {
                $billingAddress = $addresses[($index + 2) % $addresses->count()];
            }

            AccountAddress::query()
                ->where('account_id', $account->id)
                ->delete();

            AccountAddress::query()->create([
                'account_id' => $account->id,
                'address_id' => $privateAddress->id,
                'is_default' => true,
                'company_name' => null,
                'vat_nr' => null,
                'is_billing_address' => false,
            ]);

            AccountAddress::query()->create([
                'account_id' => $account->id,
                'address_id' => $billingAddress->id,
                'is_default' => false,
                'company_name' => $account->account_type === 'commercial_host'
                    ? 'Deskrl Business Spaces GmbH'
                    : 'Musterfirma GmbH',
                'vat_nr' => $account->account_type === 'commercial_host'
                    ? 'ATU12345678'
                    : 'ATU87654321',
                'is_billing_address' => true,
            ]);
        }
    }
}
