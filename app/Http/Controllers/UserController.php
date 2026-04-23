<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all();

        return Inertia::render('Users/Index', [
            'users' => $users,
        ]);
    }

    public function show(User $user)
    {
        return Inertia::render('UserProfile', [
            'user' => $user->load(['host', 'bookings']),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255|unique:users,email,'.$user->id,
            'password' => 'sometimes|string|min:8',
            'role' => 'sometimes|in:user,host,admin',
            'gender' => 'sometimes|in:male,female,diverse,undisclosed',
            'profile_image' => 'nullable|string|max:255',
            'job' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'about_me' => 'nullable|string',
            'birthday' => 'nullable|date',
        ]);

        $user->update($validated);

        return back()->with('success', 'Profil aktualisiert.');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect('/')->with('success', 'Account gelöscht.');
    }
}
