<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'username',
        'email',
        'password_hash',
        'first_name',
        'last_name',
        'dob',
        'age',
        'gender',
        'height',
        'weight',
        'role',
        'refresh_token',
        'reset_password_token',
        'reset_password_expires',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password_hash',
        'refresh_token',
        'reset_password_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'dob' => 'date',
        'reset_password_expires' => 'datetime',
    ];

    /**
     * Set the user's password.
     *
     * @param string $password
     * @return void
     */
    public function setPassword(string $password): void
    {
        $this->attributes['password_hash'] = Hash::make($password);
    }

    /**
     * Check if the provided password matches the stored hash.
     *
     * @param string $password
     * @return bool
     */
    public function comparePassword(string $password): bool
    {
        return Hash::check($password, $this->password_hash);
    }

    /**
     * Set the reset password token expiration time.
     *
     * @return void
     */
    public function setResetPasswordExpires(): void
    {
        $this->reset_password_expires = now()->addHour();
    }

    public function getAuthPassword()
    {
        return $this->password_hash;
    }

    public function getJWTIdentifier()
    {
        return $this->getKey(); // Usually the primary key of the user
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
}
