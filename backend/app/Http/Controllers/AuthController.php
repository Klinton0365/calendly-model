<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        \Log::info("Entering:", $request->all());
        $validated = $request->validate([
            'name'     => 'required',
            'email'    => 'required|email|unique:users',
            'password' => 'required|min:6',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);

        return response()->json([
            'token' => $user->createToken('auth_token')->plainTextToken,
            'user' => $user,
        ]);
    }

    public function login(Request $request)
    {

        \Log::info("Logging:", $request->all());
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        return response()->json([
            'token' => $user->createToken('auth_token')->plainTextToken,
            'user' => $user,
        ]);
    }

    public function user(Request $request)
    {
        return $request->user();
    }

    // Google Login
    public function googleRedirect()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function googleCallback()
{
    $googleUser = Socialite::driver('google')->stateless()->user();

    $user = User::updateOrCreate(
        ['email' => $googleUser->getEmail()],
        [
            'name'      => $googleUser->getName(),
            'google_id' => $googleUser->getId(),
        ]
    );

    $token = $user->createToken('auth_token')->plainTextToken;

    // ✅ Redirect back to frontend with token
    return redirect()->away(
        "http://localhost:5173/oauth-success?token={$token}"
    );
}

}
