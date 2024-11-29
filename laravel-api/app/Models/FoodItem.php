<?php 

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FoodItem extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'calories', 'macronutrients'];

    protected $casts = [
        'macronutrients' => 'array', // Automatically converts JSON to array and vice versa
    ];
}
