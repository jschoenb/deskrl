<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin Deskrl',
            'email' => 'admin@deskrl.test',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'role' => 'admin',
            'gender' => 'undisclosed',
            'profile_image' => 'profiles/admin.jpg',
            'job' => 'Platform Administrator',
            'company' => 'Deskrl',
            'birthday' => '1990-01-15',
        ]);

        User::create([
            'name' => 'Annalena Nutzerin',
            'email' => 'anna@deskrl.test',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'role' => 'user',
            'gender' => 'female',
            'profile_image' => 'profiles/anna.jpg',
            'job' => 'UX Designerin',
            'company' => 'Creative Studio',
            'about_me' => 'Ich suche regelmäßig flexible Arbeitsplätze und Besprechungsräume.',
            'birthday' => '1995-06-12',
        ]);

        User::create([
            'name' => 'Mark Nutzer',
            'email' => 'mark@deskrl.test',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'role' => 'user',
            'gender' => 'male',
            'profile_image' => 'profiles/mark.jpg',
            'job' => 'Freelance Developer',
            'company' => 'Self-employed',
            'about_me' => 'Ich buche Coworking-Plätze und ruhige Arbeitsräume.',
            'birthday' => '1992-03-21',
        ]);

        User::create([
            'name' => 'Sophie Host',
            'email' => 'sophie@deskrl.test',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'role' => 'host',
            'gender' => 'female',
            'profile_image' => 'profiles/sophie.jpg',
            'job' => 'Office Managerin',
            'company' => 'Urban Spaces GmbH',
            'about_me' => 'Ich vermiete moderne Arbeits- und Meetingräume in Wien.',
            'birthday' => '1988-09-04',
        ]);

        User::create([
            'name' => 'Daniel Host',
            'email' => 'daniel@deskrl.test',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'role' => 'host',
            'gender' => 'male',
            'profile_image' => 'profiles/daniel.jpg',
            'job' => 'Coworking Betreiber',
            'company' => 'WorkHub Flex',
            'about_me' => 'Ich betreibe flexible Coworking- und Seminarräume.',
            'birthday' => '1985-11-18',
        ]);

        User::create([
            'name' => 'Lea Private Host',
            'email' => 'lea@deskrl.test',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'role' => 'host',
            'gender' => 'female',
            'profile_image' => 'profiles/lea.jpg',
            'job' => 'Consultant',
            'company' => 'Independent',
            'about_me' => 'Ich vermiete einzelne Arbeitsplätze und kleinere Räume.',
            'birthday' => '1991-02-27',
        ]);
    }
}
