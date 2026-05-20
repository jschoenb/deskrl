<?php

namespace Database\Seeders;

use App\Models\Account;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AccountSeeder extends Seeder
{
    public function run(): void
    {
        $accounts = [
            [
                'first_name' => 'Anna',
                'last_name' => 'Muster',
                'email' => 'anna@example.com',
                'password' => Hash::make('password'),
                'email_verified' => true,
                'account_type' => 'user',
                'phone' => '+436601234567',
                'profile_image' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
                'status' => 'active',
                'birthdate' => '2001-05-12',
                'gender' => 'female',
                'about_me' => [
                    'de' => 'Ich suche flexible Arbeitsplätze für Studium und Projekte.',
                ],
            ],
            [
                'first_name' => 'Max',
                'last_name' => 'Huber',
                'email' => 'max@example.com',
                'password' => Hash::make('password'),
                'email_verified' => true,
                'account_type' => 'private_host',
                'phone' => '+436761234567',
                'profile_image' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
                'status' => 'active',
                'birthdate' => '1995-03-20',
                'gender' => 'male',
                'about_me' => [
                    'de' => 'Ich biete einen ruhigen Arbeitsplatz in meiner Wohnung an.',
                ],
            ],
            [
                'first_name' => 'Julia',
                'last_name' => 'Berger',
                'email' => 'julia@deskrl-business.at',
                'password' => Hash::make('password'),
                'email_verified' => true,
                'account_type' => 'commercial_host',
                'phone' => '+436991234567',
                'profile_image' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
                'status' => 'active',
                'birthdate' => '1990-09-15',
                'gender' => 'female',
                'about_me' => [
                    'de' => 'Ich verwalte moderne Meeting- und Seminarräume für Unternehmen.',
                ],
            ],
            [
                'first_name' => 'Admin',
                'last_name' => 'Deskrl',
                'email' => 'admin@deskrl.test',
                'password' => Hash::make('password'),
                'email_verified' => true,
                'account_type' => 'admin',
                'phone' => null,
                'profile_image' => null,
                'status' => 'active',
                'birthdate' => null,
                'gender' => 'undefined',
                'about_me' => null,
            ],
        ];

        foreach ($accounts as $account) {
            Account::query()->updateOrCreate(
                ['email' => $account['email']],
                $account
            );
        }
    }
}
