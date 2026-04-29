<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class UserController extends Controller
{
    // ── Alle User (Test-Route) ─────────────────────────────────────────────
    public function index()
    {
        return Inertia::render('Users/Index', [
            'users' => User::all(),
        ]);
    }

    // ── Profil anzeigen ────────────────────────────────────────────────────
    public function show(Request $request)
    {
        $user = $request->user();

        return Inertia::render('UserProfile', [
            'user'  => $user,
            // Favoriten-Anzahl für StatsGrid
            'stats' => [
                'totalBookings' => $user->bookings()->count(),
                'visitedPlaces' => $user->bookings()->distinct('listing_id')->count('listing_id'),
                'favorites'     => $user->favourites()->count(),
            ],
        ]);
    }

    // ── Persönliche Infos speichern ────────────────────────────────────────
    public function update(Request $request)
    {
        $validated = $request->validate([
            'first_name' => ['nullable', 'string', 'max:255'],
            'last_name'  => ['nullable', 'string', 'max:255'],
            'email'      => ['required', 'email', 'max:255'],
            'gender'     => ['nullable', 'in:male,female,diverse,undisclosed'],
            'birthday'   => ['nullable', 'date'],
            'phone'      => ['nullable', 'string', 'max:50'],
            'languages'  => ['nullable', 'string', 'max:255'],
            'job'        => ['nullable', 'string', 'max:255'],
            'company'    => ['nullable', 'string', 'max:255'],
            'about_me'   => ['nullable', 'string', 'max:1000'],
        ]);

        $user = $request->user();

        $user->name     = trim(($validated['first_name'] ?? '') . ' ' . ($validated['last_name'] ?? ''));
        $user->email    = $validated['email'];
        $user->gender   = $validated['gender'] ?? null;
        $user->birthday = $validated['birthday'] ?? null;
        $user->phone    = $validated['phone'] ?? null;
        $user->languages = $validated['languages'] ?? null;
        $user->job      = $validated['job'] ?? null;
        $user->company  = $validated['company'] ?? null;
        $user->about_me = $validated['about_me'] ?? null;

        $user->save();

        return redirect()->route('profile')->with('success', 'Persönliche Informationen gespeichert.');
    }

    // ── Adresse speichern ──────────────────────────────────────────────────
    public function updateAddress(Request $request)
    {
        $validated = $request->validate([
            'country'     => ['nullable', 'string', 'max:10'],
            'street'      => ['nullable', 'string', 'max:255'],
            'staircase'   => ['nullable', 'string', 'max:50'],
            'apartment'   => ['nullable', 'string', 'max:50'],
            'door'        => ['nullable', 'string', 'max:50'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'city'        => ['nullable', 'string', 'max:255'],
            'state'       => ['nullable', 'string', 'max:255'],
            // Wird mitgeschickt wenn Rechnungsadresse = Wohnadresse
            'billing_country'      => ['nullable', 'string', 'max:10'],
            'billing_street'       => ['nullable', 'string', 'max:255'],
            'billing_staircase'    => ['nullable', 'string', 'max:50'],
            'billing_apartment'    => ['nullable', 'string', 'max:50'],
            'billing_door'         => ['nullable', 'string', 'max:50'],
            'billing_postal_code'  => ['nullable', 'string', 'max:20'],
            'billing_city'         => ['nullable', 'string', 'max:255'],
            'billing_state'        => ['nullable', 'string', 'max:255'],
        ]);

        $request->user()->update($validated);

        return redirect()->route('profile')->with('success', 'Adresse gespeichert.');
    }

    // ── Rechnungsadresse speichern ─────────────────────────────────────────
    public function updateBilling(Request $request)
    {
        $validated = $request->validate([
            'billing_company'     => ['nullable', 'string', 'max:255'],
            'billing_vat_number'  => ['nullable', 'string', 'max:50'],
            'billing_country'     => ['nullable', 'string', 'max:10'],
            'billing_street'      => ['nullable', 'string', 'max:255'],
            'billing_staircase'   => ['nullable', 'string', 'max:50'],
            'billing_apartment'   => ['nullable', 'string', 'max:50'],
            'billing_door'        => ['nullable', 'string', 'max:50'],
            'billing_postal_code' => ['nullable', 'string', 'max:20'],
            'billing_city'        => ['nullable', 'string', 'max:255'],
            'billing_state'       => ['nullable', 'string', 'max:255'],
        ]);

        $request->user()->update($validated);

        return redirect()->route('profile')->with('success', 'Rechnungsadresse gespeichert.');
    }

    // ── Profilbild hochladen ───────────────────────────────────────────────
    public function updateImage(Request $request)
    {
        $request->validate([
            'profile_image' => ['required', 'image', 'max:5120'], // max 5 MB
        ]);

        $user = $request->user();

        // Altes Bild löschen wenn vorhanden
        if ($user->profile_image) {
            Storage::disk('public')->delete($user->profile_image);
        }

        $path = $request->file('profile_image')->store('profile-images', 'public');
        $user->update(['profile_image' => Storage::url($path)]);

        return redirect()->route('profile')->with('success', 'Profilbild aktualisiert.');
    }

    // ── Account löschen ────────────────────────────────────────────────────
    public function destroy(Request $request)
    {
        $user = $request->user();
        $user->delete();

        return redirect('/')->with('success', 'Account gelöscht.');
    }
}
