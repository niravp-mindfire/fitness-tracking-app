<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWorkoutsTable extends Migration
{
    public function up()
    {
        Schema::create('workouts', function (Blueprint $table) {
            $table->id(); // Auto-increment primary key
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Reference to the users table
            $table->date('date'); // Date of the workout
            $table->integer('duration'); // Duration in minutes
            $table->string('notes')->nullable(); // Notes for the workout (nullable)
            $table->timestamps(); // created_at and updated_at columns
        });

        // Creating an index on user_id and date
        Schema::table('workouts', function (Blueprint $table) {
            $table->index(['user_id', 'date']); // Index for user_id and date
        });
    }

    public function down()
    {
        Schema::dropIfExists('workouts');
    }
}
