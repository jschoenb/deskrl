<?php
/*
//TODO Tobis alter Code
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all();

        return Inertia::render('Users/Index', [
            'users' => $users,
        ]);
    }

    public function show(User $user): JsonResponse
    {
        $user->load(['host', 'bookings']);

        return response()->json($user);
    }

    //Login
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'message' => 'Ungültige Login-Daten.',
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login erfolgreich.',
            'user' => $user,
            'token' => $token,
        ]);
    }

    //Logout
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout erfolgreich.',
        ]);
    }

    //User erstellen
    public function register(Request $request): JsonResponse
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

    //User aktualisieren
    public function update(Request $request, User $user): JsonResponse
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

        return response()->json([
            'message' => 'User erfolgreich aktualisiert.',
            'user' => $user,
        ]);
    }

    //User löschen
    public function destroy(User $user): JsonResponse
    {
        $user->delete();

        return response()->json([
            'message' => 'User erfolgreich gelöscht.',
        ]);
    }
}*/

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

    // show user profile
    public function show(User $user)
    {
        return Inertia::render('Profile/Show', [
            'user' => $user->load(['host', 'bookings']),
        ]);
    }

    // update user profile
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
