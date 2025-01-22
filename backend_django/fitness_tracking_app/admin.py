# user_management/admin.py
from django.contrib import admin
from .models import UserProfile, FitnessGoal, Workout, Exercise, WorkoutExercise, WorkoutPlan, WorkoutPlanExercise, Challenge

class FitnessGoalAdmin(admin.ModelAdmin):
    list_display = ['goal_type', 'target_value', 'current_value', 'target_date']

class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'first_name', 'last_name', 'age', 'gender', 'height', 'weight', 'dob', 'role']
    search_fields = ['user__username', 'user__email', 'first_name', 'last_name']

class WorkoutAdmin(admin.ModelAdmin):
    # Columns to display in the list view
    list_display = ['user', 'date', 'duration', 'notes', 'created_at', 'updated_at']
    # Fields to search in the admin panel
    search_fields = ['user__username', 'user__email', 'notes']
    # Fields to filter by
    list_filter = ['date', 'user']

class ExerciseAdmin(admin.ModelAdmin):
    list_display = ['name', 'type', 'category', 'created_at', 'updated_at']
    search_fields = ['name', 'type', 'category']
    list_filter = ['type', 'category']

class WorkoutExerciseAdmin(admin.ModelAdmin):
    list_display = ['workout', 'exercise', 'sets', 'reps', 'weight']
    list_filter = ['workout', 'exercise']
    search_fields = ['workout__id', 'exercise__name']

@admin.register(WorkoutPlan)
class WorkoutPlanAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'title', 'duration', 'created_at')
    search_fields = ('title', 'user__username')
    list_filter = ('duration', 'created_at')

@admin.register(WorkoutPlanExercise)
class WorkoutPlanExerciseAdmin(admin.ModelAdmin):
    list_display = ('id', 'workout_plan', 'exercise', 'sets', 'reps')
    search_fields = ('workout_plan__title', 'exercise__name')
    list_filter = ('sets', 'reps')

@admin.register(Challenge)
class ChallengeAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'start_date', 'end_date', 'created_at')
    search_fields = ('title', 'description')
    list_filter = ('start_date', 'end_date', 'created_at')

# Register the models with the admin site
admin.site.register(FitnessGoal, FitnessGoalAdmin)
admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(Workout, WorkoutAdmin)
admin.site.register(Exercise, ExerciseAdmin)
admin.site.register(WorkoutExercise, WorkoutExerciseAdmin)