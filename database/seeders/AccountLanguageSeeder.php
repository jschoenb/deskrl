<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\Language;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AccountLanguageSeeder extends Seeder
{
    /**
     * Seed language assignments for existing accounts.
     */
    public function run(): void
    {
        $accounts = Account::query()->get();
        $german = Language::query()->where('name', 'Deutsch')->first();
        $english = Language::query()->where('name', 'Englisch')->first();

        if ($accounts->isEmpty()) {
            $this->command->warn('No accounts found. Please seed accounts before account languages.');
            return;
        }

        if (!$german) {
            $this->command->warn('No German language found. Please seed languages before account languages.');
            return;
        }

        foreach ($accounts as $account) {
            DB::table('account_language')->updateOrInsert(
                [
                    'account_id' => $account->id,
                    'language_id' => $german->id,
                ],
                [
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        if ($english) {
            $commercialAccount = Account::query()
                ->where('email', 'julia@deskrl-business.at')
                ->first();

            if ($commercialAccount) {
                DB::table('account_language')->updateOrInsert(
                    [
                        'account_id' => $commercialAccount->id,
                        'language_id' => $english->id,
                    ],
                    [
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }
        }
    }
}
