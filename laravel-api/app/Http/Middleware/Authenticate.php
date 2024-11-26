<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Exceptions\HttpResponseException;

class Authenticate extends Middleware
{
    protected function redirectTo($request)
    {
        throw new HttpResponseException(
            response()->json(['error' => 'Unauthenticated.'], 401)
        );
    }
}
