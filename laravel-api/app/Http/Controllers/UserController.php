<?php 

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Carbon\Carbon;

use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Facades\Auth;


class UserController extends Controller
{
    // Register a new user
    public function register(Request $request)
    {
        $request->validate([
            'profile.first_name' => 'required|string|max:255',
            'profile.last_name' => 'required|string|max:255',
            'profile.dob' => 'required|date',
            'username' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'first_name' => $request->input('profile.first_name'),
            'last_name' => $request->input('profile.last_name'),
            'dob' => $request->input('profile.dob'),
            'username' => $request->username,
            'email' => $request->email,
            'password_hash' => Hash::make($request->password),
            'role' => 'user',
        ]);

        return response()->json(['message' => 'User registered successfully', 'user' => $user], 201);
    }

    // Login a user
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $credentials = $request->only('email', 'password');

        try {
            // Attempt to authenticate the user and get the access token with expiration of 4 hours
            if (!$token = JWTAuth::attempt($credentials, ['exp' => Carbon::now()->addHours(4)->timestamp])) {
                return response()->json(['message' => 'Invalid email or password'], 401);
            }
        } catch (JWTException $e) {
            return response()->json(['message' => 'Could not create token'], 500);
        }

        // Get the authenticated user
        $user = auth()->user();

        // Generate a refresh token with an expiration of 8 hours
        $refreshToken = Str::random(60); // Generate a random string for the refresh token

        // Store the refresh token and its expiration time in the User model
        $user->refresh_token = $refreshToken;
        $user->refresh_token_expires_at = Carbon::now()->addHours(8); // Store expiration time for refresh token
        $user->save();

        // Return both the access token and refresh token
        return response()->json([
            'message' => 'Login successful',
            'token' => $token,           // Access token (JWT)
            'refresh_token' => $refreshToken, // Refresh token
            'user' => $user,              // User data
        ]);
    }

    // Forgot password
    public function forgetPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'Email does not exist'], 400);
        }

        $resetToken = Str::random(60);
        $user->update([
            'reset_password_token' => $resetToken,
            'reset_password_expires' => Carbon::now()->addHours(1),
        ]);

        // Send reset link
        Mail::send('emails.reset-password', ['token' => $resetToken], function ($message) use ($request) {
            $message->to($request->email)->subject('Password Reset Request');
        });

        return response()->json(['message' => 'Password reset link sent']);
    }

    // Reset password
    public function resetPassword(Request $request, $resetToken)
    {
        $request->validate(['password' => 'required|string|min:8']);

        $user = User::where('reset_password_token', $resetToken)
            ->where('reset_password_expires', '>', Carbon::now())
            ->first();

        if (!$user) {
            return response()->json(['message' => 'Invalid or expired reset token'], 400);
        }

        $user->update([
            'password_hash' => Hash::make($request->password),
            'reset_password_token' => null,
            'reset_password_expires' => null,
        ]);

        return response()->json(['message' => 'Password reset successfully']);
    }

    public function editProfile(Request $request)
    {
        // Validate input
        $validatedData = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'age' => 'sometimes|integer|min:0',
            'gender' => 'sometimes|string|in:male,female,other',
            'height' => 'sometimes|numeric|min:0',
            'weight' => 'sometimes|numeric|min:0',
            'dob' => 'sometimes|date',
        ]);

        // Get the logged-in user
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found.',
            ], 404);
        }

        // Update profile fields
        $user->update([
            'first_name' => $validatedData['first_name'] ?? $user->first_name,
            'last_name' => $validatedData['last_name'] ?? $user->last_name,
            'age' => $validatedData['age'] ?? $user->age,
            'gender' => $validatedData['gender'] ?? $user->gender,
            'height' => $validatedData['height'] ?? $user->height,
            'weight' => $validatedData['weight'] ?? $user->weight,
            'dob' => $validatedData['dob'] ?? $user->dob,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Profile updated successfully.',
            'data' => $user,
        ]);
    }

    /**
     * Get the authenticated user's profile
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getMyProfile()
    {
        // Get the logged-in user
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'User profile retrieved successfully.',
            'data' => $user,
        ]);
    }

    // Refresh token
    public function refreshToken(Request $request)
    {
        $request->validate(['refresh_token' => 'required|string']);

        // Find the user based on the provided refresh token and ensure it hasn't expired
        $user = User::where('refresh_token', $request->refresh_token)
                    ->where('refresh_token_expires_at', '>', Carbon::now()) // Check if the refresh token is still valid
                    ->first();

        // If user does not exist or refresh token is invalid/expired
        if (!$user) {
            return response()->json(['message' => 'Invalid or expired refresh token'], 400);
        }

        // Generate a new access token using the user data
        $newToken = JWTAuth::fromUser($user, ['exp' => Carbon::now()->addHours(4)->timestamp]);

        return response()->json(['token' => $newToken]);
    }
}