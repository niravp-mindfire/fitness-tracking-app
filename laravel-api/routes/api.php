<?php 

use App\Http\Controllers\UserController;
use App\Http\Controllers\WorkoutController;

Route::get("/health-check", function() {
    return response()->json(['message' => 'Server is working']);
});
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
Route::post('/forget-password', [UserController::class, 'forgetPassword']);
Route::post('/reset-password/{resetToken}', [UserController::class, 'resetPassword']);
Route::post('/refresh-token', [UserController::class, 'refreshToken']);

Route::middleware('auth:api')->group(function () {
    Route::get('/profile', [UserController::class, 'getMyProfile']);
    Route::put('/profile', [UserController::class, 'editProfile']);

    Route::get('/workouts', [WorkoutController::class, 'index']);
    Route::get('/workouts/{id}', [WorkoutController::class, 'show']);
    Route::post('/workouts', [WorkoutController::class, 'store']);
    Route::put('/workouts/{id}', [WorkoutController::class, 'update']);
    Route::delete('/workouts/{id}', [WorkoutController::class, 'destroy']);
});
