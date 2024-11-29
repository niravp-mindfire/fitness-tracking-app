<?php 

use App\Http\Controllers\UserController;
use App\Http\Controllers\WorkoutController;
use App\Http\Controllers\ExerciseController;
use App\Http\Controllers\WorkoutPlanController;
use App\Http\Controllers\ChallengeController;
use App\Http\Controllers\FoodItemController;

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

    Route::get('/exercises', [ExerciseController::class, 'index']);
    Route::get('/exercises/{id}', [ExerciseController::class, 'show']);
    Route::post('/exercises', [ExerciseController::class, 'store']);
    Route::put('/exercises/{id}', [ExerciseController::class, 'update']);
    Route::delete('/exercises/{id}', [ExerciseController::class, 'destroy']);

    Route::apiResource('workout-plans', WorkoutPlanController::class);
    Route::apiResource('challenges', ChallengeController::class);

    Route::apiResource('food-items', FoodItemController::class);
});
