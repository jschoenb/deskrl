<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all();

        return Inertia::render('Users/Index', [
            'users' => $users,
        ]);
    }

    public function show(Request $request)
    {
        return Inertia::render('UserProfile', [
            'user' => $request->user(),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'first_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'gender' => ['nullable', 'in:male,female,diverse,undisclosed'],
            'birthday' => ['nullable', 'date'],
            'phone' => ['nullable', 'string', 'max:50'],
            'languages' => ['nullable', 'string', 'max:255'],
            'job' => ['nullable', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'about_me' => ['nullable', 'string', 'max:1000'],
        ]);

        $user = $request->user();

        $user->name = trim(($validated['first_name'] ?? '').' '.($validated['last_name'] ?? ''));
        $user->email = $validated['email'];
        $user->gender = $validated['gender'] ?? null;
        $user->birthday = $validated['birthday'] ?? null;
        $user->phone = $validated['phone'] ?? null;
        $user->languages = $validated['languages'] ?? null;
        $user->job = $validated['job'] ?? null;
        $user->company = $validated['company'] ?? null;
        $user->about_me = $validated['about_me'] ?? null;

        $user->save();

        return redirect()->route('profile')->with('success', 'Profil gespeichert.');
    }

    public function destroy(User $user)
    {
        $user->delete();

        return redirect('/')->with('success', 'Account gelöscht.');
    }
}
