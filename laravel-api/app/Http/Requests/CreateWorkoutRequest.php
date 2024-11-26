<?php

// app/Http/Requests/CreateWorkoutRequest.php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateWorkoutRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Ensure the user is authorized to create a workout
    }

    public function rules()
    {
        return [
            'date' => 'required|date_format:Y-m-d',
            'duration' => 'required|integer|min:1',
            'notes' => 'nullable|string',
        ];
    }
}
