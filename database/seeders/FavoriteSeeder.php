<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\Deskrl;
use App\Models\Favorite;
use Illuminate\Database\Seeder;

class FavoriteSeeder extends Seeder
{
    public function run(): void
    {
        $user = Account::query()
            ->where('account_type', 'user')
            ->first();

        $deskrls = Deskrl::query()->take(2)->get();

        if (!$user) {
            $this->command->warn('No user account found. Please seed accounts before favorites.');
            return;
        }

        if ($deskrls->isEmpty()) {
            $this->command->warn('No deskrls found. Please seed deskrls before favorites.');
            return;
        }

        foreach ($deskrls as $deskrl) {
            Favorite::query()->updateOrCreate(
                [
                    'user_id' => $user->id,
                    'listing_id' => $deskrl->id,
                ],
                []
            );
        }
    }
}
