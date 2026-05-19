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
     *
     * This method only returns the Inertia React component for the register form.
     * No data is stored here yet.
     */
    public function showRegister()
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handles the registration of a new account.
     *
     * The method validates the submitted form data, creates a new account,
     * hashes the password, logs the new account in immediately and redirects
     * the user to the account page.
     */
    public function register(Request $request)
    {
        // Validates the registration data before creating a new account.
        // The password must be confirmed, so the request must also contain
        // a matching "password_confirmation" field.
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:accounts,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        // Creates a new account using the validated data.
        // The password is hashed before it is stored in the database.
        // Default values are assigned for account type, status, gender
        // and email verification state.
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

        // Logs in the newly created account.
        // This means the user does not need to log in manually after registration.
        Auth::login($account);

        // Regenerates the session ID after login.
        // This is an important security step against session fixation attacks.
        $request->session()->regenerate();

        // Redirects the logged-in user to their account page.
        return redirect()->route('account.show');
    }

    /**
     * Shows the login page.
     *
     * This method only returns the Inertia React component for the login form.
     */
    public function showLogin()
    {
        return Inertia::render('Auth/Login');
    }

    /**
     * Handles the login of an existing account.
     *
     * The method validates the submitted credentials, checks whether the
     * email and password match an existing account and starts a logged-in
     * session if the credentials are correct.
     */
    public function login(Request $request)
    {
        // Validates the login form data.
        // Only email and password are required for authentication.
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        // Attempts to authenticate the account with the given credentials.
        // Auth::attempt() automatically checks the hashed password.
        // If authentication fails, the user is redirected back with an error.
        if (! Auth::attempt($credentials)) {
            return back()
                ->withErrors([
                    'email' => 'Die eingegebenen Login-Daten sind ungültig.',
                ])
                ->onlyInput('email');
        }

        // Regenerates the session ID after successful login.
        // This improves security and prevents session fixation.
        $request->session()->regenerate();

        // Redirects the user to the originally requested protected page.
        // If there is no intended page, the user is redirected to account.show.
        return redirect()->intended(route('account.show'));
    }

    /**
     * Logs out the currently authenticated account.
     *
     * The method ends the authentication session, invalidates the current
     * session data, regenerates the CSRF token and redirects the user back
     * to the login page.
     */
    public function logout(Request $request)
    {
        // Logs out the currently authenticated account.
        Auth::logout();

        // Invalidates the current session.
        // This removes all session data for the logged-out user.
        $request->session()->invalidate();

        // Regenerates the CSRF token after logout.
        // This prevents the old token from being reused.
        $request->session()->regenerateToken();

        // Redirects the user to the login page after logout.
        return redirect()->route('login');
    }
}
