from django.contrib import admin
from .models import UserProfile, FitnessGoal, Workout, Exercise, WorkoutExercise, WorkoutPlan, WorkoutPlanExercise, Challenge, FoodItem, Nutrition, NutritionMeal, NutritionMealFoodItem


class FitnessGoalAdmin(admin.ModelAdmin):
    """
    Admin for managing fitness goals of users.
    """
    list_display = ['goal_type', 'target_value', 'current_value', 'target_date']


class UserProfileAdmin(admin.ModelAdmin):
    """
    Admin for managing user profile details.
    """
    list_display = ['user', 'first_name', 'last_name', 'age', 'gender', 'height', 'weight', 'dob', 'role']
    search_fields = ['user__username', 'user__email', 'first_name', 'last_name']


class WorkoutAdmin(admin.ModelAdmin):
    """
    Admin for managing user workouts.
    """
    list_display = ['user', 'date', 'duration', 'notes', 'created_at', 'updated_at']
    search_fields = ['user__username', 'user__email', 'notes']
    list_filter = ['date', 'user']


class ExerciseAdmin(admin.ModelAdmin):
    """
    Admin for managing exercise data.
    """
    list_display = ['name', 'type', 'category', 'created_at', 'updated_at']
    search_fields = ['name', 'type', 'category']
    list_filter = ['type', 'category']


class WorkoutExerciseAdmin(admin.ModelAdmin):
    """
    Admin for managing workout exercises.
    """
    list_display = ['workout', 'exercise', 'sets', 'reps', 'weight']
    list_filter = ['workout', 'exercise']
    search_fields = ['workout__id', 'exercise__name']


@admin.register(WorkoutPlan)
class WorkoutPlanAdmin(admin.ModelAdmin):
    """
    Admin for managing workout plans.
    """
    list_display = ('id', 'user', 'title', 'duration', 'created_at')
    search_fields = ('title', 'user__username')
    list_filter = ('duration', 'created_at')


@admin.register(WorkoutPlanExercise)
class WorkoutPlanExerciseAdmin(admin.ModelAdmin):
    """
    Admin for managing exercises within workout plans.
    """
    list_display = ('id', 'workout_plan', 'exercise', 'sets', 'reps')
    search_fields = ('workout_plan__title', 'exercise__name')
    list_filter = ('sets', 'reps')


@admin.register(Challenge)
class ChallengeAdmin(admin.ModelAdmin):
    """
    Admin for managing challenges.
    """
    list_display = ('id', 'title', 'start_date', 'end_date', 'created_at')
    search_fields = ('title', 'description')
    list_filter = ('start_date', 'end_date', 'created_at')


@admin.register(FoodItem)
class FoodItemAdmin(admin.ModelAdmin):
    """
    Admin for managing food items.
    """
    list_display = ('id', 'name', 'calories', 'carbohydrates', 'proteins', 'fats', 'created_at')
    search_fields = ('name',)
    list_filter = ('created_at', 'updated_at')


@admin.register(Nutrition)
class NutritionAdmin(admin.ModelAdmin):
    """
    Admin for managing nutrition records.
    """
    list_display = ('id', 'user', 'date', 'notes', 'created_at', 'updated_at')
    search_fields = ('user__username', 'date', 'notes')
    list_filter = ('date', 'created_at', 'updated_at')


@admin.register(NutritionMeal)
class NutritionMealAdmin(admin.ModelAdmin):
    """
    Admin for managing nutrition meals.
    """
    list_display = ('id', 'nutrition', 'meal_type', 'total_calories', 'created_at', 'updated_at')
    search_fields = ('nutrition__user__username', 'meal_type')
    list_filter = ('meal_type', 'created_at', 'updated_at')


@admin.register(NutritionMealFoodItem)
class NutritionMealFoodItemAdmin(admin.ModelAdmin):
    """
    Admin for managing food items in nutrition meals.
    """
    list_display = ('id', 'nutrition_meal', 'food_item', 'quantity')
    search_fields = ('nutrition_meal__meal_type', 'food_item__name')


# Register the models with the admin site using decorators
admin.site.register(FitnessGoal, FitnessGoalAdmin)
admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(Workout, WorkoutAdmin)
admin.site.register(Exercise, ExerciseAdmin)
admin.site.register(WorkoutExercise, WorkoutExerciseAdmin)
