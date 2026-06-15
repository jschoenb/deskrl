<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AccountController extends Controller
{
    /**
     * Shows the profile page of the currently logged-in account.
     */
    public function show(Request $request)
    {
        $account = $request->user()->load([
            'languages',
            'accountAddresses.address.country',
            'commercialAccount',
        ]);

        return Inertia::render('UserProfile', [
            'account' => $account,
            'stats' => [
                'totalBookings' => $account->bookings()->count(),
                'visitedPlaces' => 0,
                'favorites' => $account->favorites()->count(),
            ],
        ]);
    }

    /**
     * Shows the edit form for the currently logged-in account.
     */
    public function edit(Request $request)
    {
        $account = $request->user()->load([
            'languages',
            'accountAddresses.address.country',
            'commercialAccount',
        ]);

        return Inertia::render('UserProfile', [
            'account' => $account,
            'stats' => [
                'totalBookings' => $account->bookings()->count(),
                'visitedPlaces' => 0,
                'favorites' => $account->favorites()->count(),
            ],
        ]);
    }

    /**
     * Updates the currently logged-in account and optionally changes the password.
     */
    public function update(Request $request)
    {
        $account = $request->user();

        $validated = $request->validate(
            [
                'first_name' => ['required', 'string', 'max:255', 'regex:/^[\pL\s\-]+$/u'],
                'last_name' => ['required', 'string', 'max:255', 'regex:/^[\pL\s\-]+$/u'],

                'email' => [
                    'required',
                    'email',
                    'max:255',
                    Rule::unique('accounts', 'email')->ignore($account->id),
                ],

                'phone' => ['nullable', 'string', 'max:50', 'regex:/^[0-9+\s\/().-]*$/'],
                'birthdate' => ['nullable', 'date', 'before:today'],

                'gender' => [
                    'required',
                    Rule::in(['male', 'female', 'diverse', 'undefined']),
                ],

                'about_me' => ['nullable', 'array'],
                'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            ],
            [
                'first_name.required' => 'Bitte gib einen Vornamen ein.',
                'first_name.regex' => 'Der Vorname darf nur Buchstaben, Leerzeichen und Bindestriche enthalten.',
                'first_name.max' => 'Der Vorname darf maximal 255 Zeichen lang sein.',

                'last_name.required' => 'Bitte gib einen Nachnamen ein.',
                'last_name.regex' => 'Der Nachname darf nur Buchstaben, Leerzeichen und Bindestriche enthalten.',
                'last_name.max' => 'Der Nachname darf maximal 255 Zeichen lang sein.',

                'email.required' => 'Bitte gib eine E-Mail-Adresse ein.',
                'email.email' => 'Bitte gib eine gültige E-Mail-Adresse ein.',
                'email.unique' => 'Diese E-Mail-Adresse wird bereits verwendet.',
                'email.max' => 'Die E-Mail-Adresse darf maximal 255 Zeichen lang sein.',

                'phone.regex' => 'Die Telefonnummer darf nur Zahlen, Leerzeichen und die Zeichen + / ( ) . - enthalten.',
                'phone.max' => 'Die Telefonnummer darf maximal 50 Zeichen lang sein.',

                'birthdate.date' => 'Bitte gib ein gültiges Geburtsdatum ein.',
                'birthdate.before' => 'Das Geburtsdatum muss in der Vergangenheit liegen.',

                'gender.required' => 'Bitte wähle ein Geschlecht aus.',
                'gender.in' => 'Das ausgewählte Geschlecht ist ungültig.',

                'password.min' => 'Das Passwort muss mindestens 8 Zeichen lang sein.',
                'password.confirmed' => 'Die Passwortbestätigung stimmt nicht überein.',
            ]
        );

        if (! empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $account->update($validated);

        return redirect()
            ->back()
            ->with('success', 'Account wurde aktualisiert.');
    }

    /**
     * Updates the profile image of the currently logged-in account.
     */
    public function updateImage(Request $request)
    {
        $account = $request->user();

        $request->validate(
            [
                'profile_image' => ['required', 'image', 'max:4096'],
            ],
            [
                'profile_image.required' => 'Bitte wähle ein Profilbild aus.',
                'profile_image.image' => 'Die Datei muss ein Bild sein.',
                'profile_image.max' => 'Das Profilbild darf maximal 4 MB groß sein.',
            ]
        );

        if (
            $account->profile_image &&
            Storage::disk('public')->exists($account->profile_image)
        ) {
            Storage::disk('public')->delete($account->profile_image);
        }

        $path = $request->file('profile_image')->store('profile_images', 'public');

        $account->update([
            'profile_image' => $path,
        ]);

        return redirect()
            ->back()
            ->with('success', 'Profilbild wurde aktualisiert.');
    }

    /**
     * Upgrades the currently logged-in account to a private or commercial host account.
     */
    public function becomeProvider(Request $request)
    {
        $account = $request->user();

        $validated = $request->validate(
            [
                'provider_type' => ['required', 'string', 'in:private_host,commercial_host'],
            ],
            [
                'provider_type.required' => 'Bitte wähle einen Anbieter-Typ aus.',
                'provider_type.in' => 'Der ausgewählte Anbieter-Typ ist ungültig.',
            ]
        );

        $account->update([
            'account_type' => $validated['provider_type'],
        ]);

        return redirect()
            ->back()
            ->with('success', 'Dein Anbieterprofil wurde aktiviert.');
    }

    /**
     * Marks the currently logged-in account as deleted and ends the session.
     */
    public function destroy(Request $request)
    {
        $account = $request->user();

        Auth::logout();

        $account->update([
            'status' => 'deleted',
        ]);

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
