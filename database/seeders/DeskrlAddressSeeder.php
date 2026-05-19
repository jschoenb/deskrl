<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\Deskrl;
use App\Models\DeskrlAddress;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DeskrlAddressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Deskrl addresses need existing Deskrls and existing addresses.
        $deskrls = Deskrl::query()->get();
        $addresses = Address::query()->get();

        if ($deskrls->isEmpty()) {
            $this->command->warn('No deskrls found. Please seed deskrls before deskrl addresses.');
            return;
        }

        if ($addresses->isEmpty()) {
            $this->command->warn('No addresses found. Please seed addresses before deskrl addresses.');
            return;
        }

        foreach ($deskrls as $index => $deskrl) {
            // Reuse existing addresses. If there are fewer addresses than Deskrls,
            // addresses will be assigned repeatedly.
            $address = $addresses[$index % $addresses->count()];

            DeskrlAddress::query()->updateOrCreate(
                [
                    'deskrl_id' => $deskrl->id,
                ],
                [
                    'address_id' => $address->id,
                ]
            );
        }
    }
}
