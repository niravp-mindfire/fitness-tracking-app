<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GetAllWorkoutsRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'page' => 'nullable|integer|min:1',
            'limit' => 'nullable|integer|min:1',
            'startDate' => 'nullable|date|iso8601',
            'endDate' => 'nullable|date|iso8601',
            'sort' => 'nullable|in:date,duration',
            'order' => 'nullable|in:asc,desc',
        ];
    }

    public function messages()
    {
        return [
            'page.integer' => 'Page must be a positive integer',
            'limit.integer' => 'Limit must be a positive integer',
            'startDate.date' => 'Invalid startDate format',
            'endDate.date' => 'Invalid endDate format',
            'sort.in' => 'Sort must be either "date" or "duration"',
            'order.in' => 'Order must be either "asc" or "desc"',
        ];
    }
}
