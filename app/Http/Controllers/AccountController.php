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
     *
     * The account is loaded from the authenticated session.
     * Related data such as addresses, languages and commercial account
     * can also be loaded here if needed for the profile page.
     * Test
     */
    public function show(Request $request)
    {
        // Load the authenticated account with all relations needed by the profile page.
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
     *
     * This method does not update any data yet.
     * It only returns the React component containing the edit form.
     */
    public function edit(Request $request)
    {
        // The edit page uses the same data as the show page.
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
     * Updates the currently logged-in account.
     *
     * The method validates the submitted profile data and updates
     * the account record in the database.
     * If a new password is submitted, it is hashed before saving.
     */
    public function update(Request $request)
    {
        // Gets the currently authenticated account.
        $account = $request->user();

        // Validates the submitted account data.
        // The email must be unique, but the current account's email is ignored.
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],

            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('accounts', 'email')->ignore($account->id),
            ],

            'phone' => ['nullable', 'string', 'max:255'],
            'birthdate' => ['nullable', 'date'],

            'gender' => [
                'required',
                Rule::in(['male', 'female', 'diverse', 'undefined']),
            ],

            'about_me' => ['nullable', 'array'],

            // Password is optional during profile update.
            // If it is provided, it must be confirmed with password_confirmation.
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
        ]);

        // If a new password was entered, it is hashed before being saved.
        // If no password was entered, the password field is removed
        // so the existing password stays unchanged.
        if (! empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        // Updates the account with the validated data.
        $account->update($validated);

        // Redirects back to the account profile page after successful update.
        return redirect()
            ->route('account.show')
            ->with('success', 'Account wurde aktualisiert.');
    }

    /**
     * Updates the profile image of the currently logged-in account.
     *
     * The uploaded image is stored in the public storage disk.
     * Only the image path is saved in the accounts table.
     */
    public function updateImage(Request $request)
    {
        // Gets the currently authenticated account.
        $account = $request->user();

        // Validates the uploaded profile image.
        $request->validate([
            'profile_image' => ['required', 'image', 'max:4096'],
        ]);

        // Deletes the old profile image from storage if it exists.
        if (
            $account->profile_image &&
            Storage::disk('public')->exists($account->profile_image)
        ) {
            Storage::disk('public')->delete($account->profile_image);
        }

        // Stores the new image in storage/app/public/profile_images.
        $path = $request->file('profile_image')->store('profile_images', 'public');

        // Saves only the image path in the database.
        $account->update([
            'profile_image' => $path,
        ]);

        return redirect()
            ->route('account.show')
            ->with('success', 'Profilbild wurde aktualisiert.');
    }


    /**
     * Deletes or deactivates the currently logged-in account.
     *
     * For the MVP, the account is not physically deleted from the database.
     * Instead, its status is set to "deleted". This keeps related data stable,
     * for example bookings, addresses or deskrls connected to the account.
     */
    public function destroy(Request $request)
    {
        // Gets the currently authenticated account.
        $account = $request->user();

        // Logs the account out before marking it as deleted.
        Auth::logout();

        // Soft-deactivates the account by changing its status.
        $account->update([
            'status' => 'deleted',
        ]);

        // Invalidates the current session.
        $request->session()->invalidate();

        // Regenerates the CSRF token for security.
        $request->session()->regenerateToken();

        // Redirects the user to the login page after account deletion.
        return redirect()->route('login');
    }
}
