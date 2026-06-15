<?php

namespace App\Http\Controllers;

use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Shows the registration page.
     */
    public function showRegister()
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Registers a new account and logs it in immediately.
     */
    public function register(Request $request)
    {
        $validated = $request->validate(
            [
                'first_name' => ['required', 'string', 'max:255', 'regex:/^[\pL\s\-]+$/u'],
                'last_name' => ['required', 'string', 'max:255', 'regex:/^[\pL\s\-]+$/u'],
                'email' => ['required', 'email', 'max:255', 'unique:accounts,email'],
                'password' => ['required', 'string', 'min:8', 'confirmed'],
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

                'password.required' => 'Bitte gib ein Passwort ein.',
                'password.min' => 'Das Passwort muss mindestens 8 Zeichen lang sein.',
                'password.confirmed' => 'Die Passwortbestätigung stimmt nicht überein.',
            ]
        );

        $account = Account::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'account_type' => 'user',
            'status' => 'active',
            'gender' => 'undefined',
            'email_verified' => false,
        ]);

        Auth::login($account);

        $request->session()->regenerate();

        return redirect()->route('account.show');
    }

    /**
     * Shows the login page.
     */
    public function showLogin()
    {
        return Inertia::render('Auth/Login');
    }

    /**
     * Authenticates an existing account and redirects it to the intended page.
     */
    public function login(Request $request)
    {
        $credentials = $request->validate(
            [
                'email' => ['required', 'email'],
                'password' => ['required', 'string'],
            ],
            [
                'email.required' => 'Bitte gib deine E-Mail-Adresse ein.',
                'email.email' => 'Bitte gib eine gültige E-Mail-Adresse ein.',
                'password.required' => 'Bitte gib dein Passwort ein.',
            ]
        );

        if (! Auth::attempt($credentials)) {
            return back()
                ->withErrors([
                    'email' => 'Die eingegebenen Login-Daten sind ungültig.',
                ])
                ->onlyInput('email');
        }

        $request->session()->regenerate();

        return redirect()->intended(route('account.show'));
    }

    /**
     * Logs out the currently authenticated account and resets the session.
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home');
    }
}
