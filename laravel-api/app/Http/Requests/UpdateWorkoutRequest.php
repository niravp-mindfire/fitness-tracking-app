<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWorkoutRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'date' => 'nullable|date|iso8601',
            'duration' => 'nullable|integer|min:1',
            'notes' => 'nullable|string',
        ];
    }

    public function messages()
    {
        return [
            'date.date' => 'Invalid date format',
            'duration.integer' => 'Duration must be a positive integer',
            'duration.min' => 'Duration must be at least 1 minute',
            'notes.string' => 'Notes must be a string',
        ];
    }
}
