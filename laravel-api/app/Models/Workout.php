<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Workout extends Model
{
    use HasFactory;

    // Specify the table name (if it's different from the default pluralized model name)
    protected $table = 'workouts';

    // Disable automatic timestamp management (Laravel will handle it automatically)
    public $timestamps = true;

    // Define the fillable attributes (for mass assignment)
    protected $fillable = [
        'user_id', 
        'date', 
        'duration', 
        'notes'
    ];

    // Cast attributes to the desired data type
    protected $casts = [
        'date' => 'datetime', // Ensure date is cast to a Carbon instance
    ];

    /**
     * Get the user that owns the workout.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope a query to only include workouts for a given user.
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }
}
