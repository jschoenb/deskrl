<?php
/*
namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthController extends Controller
{
    //
}*/


namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    //user login
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            return redirect()->intended('/');
        }

        return back()->withErrors([
            'email' => 'Die angegebenen Zugangsdaten sind falsch.',
        ]);
    }

    //user registration
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'role' => 'required|in:user,host',
            'password' => [
                'required',
                'string',
                'min:8',              // At least 8 characters
                'regex:/[a-z]/',      // At least 1 lowercase letter
                'regex:/[A-Z]/',      // At least 1 uppercase letter
                'regex:/[0-9]/',      // At least 1 digit
                'regex:/[@$!%*#?&]/', // At least 1 special character
                'not_regex:/\s/',     // No spaces
            ],
        ], [
            // Custom error messages sent back to the React frontend
            'password.min' => 'Das Passwort muss mindestens 8 Zeichen lang sein.',
            'password.regex' => 'Das Passwort muss Groß- und Kleinbuchstaben, eine Ziffer und ein Sonderzeichen enthalten.',
            'password.not_regex' => 'Das Passwort darf keine Leerzeichen enthalten.',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        Auth::login($user);

        return redirect('/');
    }

    //user logout
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
