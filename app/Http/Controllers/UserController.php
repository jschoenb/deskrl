<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all();
        return Inertia::render('Users/Index', [
            'users' => $users
        ]);
    }

    public function show(User $user): JsonResponse
    {
        $user->load(['host', 'bookings']);

        return response()->json($user);
    }

    /**
     * User erstellen
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|in:user,host,admin',
            'gender' => 'nullable|in:male,female,diverse,undisclosed',
            'profile_image' => 'nullable|string|max:255',
            'job' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'about_me' => 'nullable|string',
            'birthday' => 'nullable|date',
        ]);

        $user = User::create($validated);

        return response()->json([
            'message' => 'User erfolgreich erstellt.',
            'user' => $user,
        ], 201);
    }

    /**
     * User aktualisieren
     */
    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255|unique:users,email,' . $user->id,
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

        return response()->json([
            'message' => 'User erfolgreich aktualisiert.',
            'user' => $user,
        ]);
    }

    /**
     * User löschen
     */
    public function destroy(User $user): JsonResponse
    {
        $user->delete();

        return response()->json([
            'message' => 'User erfolgreich gelöscht.',
        ]);
    }
}
