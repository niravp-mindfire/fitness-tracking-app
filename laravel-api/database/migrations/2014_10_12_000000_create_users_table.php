<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->string('username')->unique();
            $table->string('email')->unique();
            $table->string('password_hash');
            $table->string('first_name');
            $table->string('last_name');
            $table->date('dob');
            $table->integer('age')->nullable();
            $table->enum('gender', ['male', 'female', 'other']);
            $table->float('height')->nullable();
            $table->float('weight')->nullable();
            $table->enum('role', ['admin', 'user'])->default('user');
            $table->text('refresh_token')->nullable();
            $table->string('reset_password_token')->nullable();
            $table->timestamp('reset_password_expires')->nullable();
            $table->timestamps(); // Includes created_at and updated_at
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
