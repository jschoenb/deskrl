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

        if ($addresses->count() < 2) {
            $this->command->warn('At least two addresses are needed to create separate private and billing addresses.');
            return;
        }

        foreach ($accounts as $index => $account) {
            // Select one address as the private/default address.
            $privateAddress = $addresses[$index % $addresses->count()];

            // Select a different address as the billing address.
            $billingAddress = $addresses[($index + 1) % $addresses->count()];

            // Safety check: private and billing address must not be the same.
            if ($privateAddress->id === $billingAddress->id) {
                $billingAddress = $addresses[($index + 2) % $addresses->count()];
            }

            // Remove old address links for this account before creating clean seed data.
            AccountAddress::query()
                ->where('account_id', $account->id)
                ->delete();

            // Create the private/default address relation.
            AccountAddress::query()->create([
                'account_id' => $account->id,
                'address_id' => $privateAddress->id,
                'is_default' => true,
                'company_name' => null,
                'vat_nr' => null,
                'is_billing_address' => false,
            ]);

            // Create the separate billing address relation.
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
