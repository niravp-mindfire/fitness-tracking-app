<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DeleteWorkoutRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'id' => 'required|exists:workouts,id', // Ensure that the workout ID exists in the workouts table
        ];
    }

    public function messages()
    {
        return [
            'id.exists' => 'Invalid workout ID format',
        ];
    }
}
