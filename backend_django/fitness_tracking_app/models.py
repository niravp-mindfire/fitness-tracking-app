# user_management/models.py
from django.contrib.auth.models import AbstractUser, User
from django.db import models

class FitnessGoal(models.Model):
    goal_type = models.CharField(max_length=50)
    target_value = models.FloatField()
    current_value = models.FloatField()
    target_date = models.DateField()

    def __str__(self):
        return self.goal_type


class UserProfile(models.Model):
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    age = models.IntegerField()
    gender = models.CharField(max_length=10)
    height = models.FloatField()
    weight = models.FloatField()
    dob = models.DateField()
    fitness_goals = models.ManyToManyField(FitnessGoal)
    role = models.CharField(max_length=10, choices=[('admin', 'Admin'), ('user', 'User')], default='user')
    refresh_token = models.CharField(max_length=255, null=True, blank=True)
    reset_password_token = models.CharField(max_length=255, null=True, blank=True)
    reset_password_expires = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.user.username

class Workout(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="workouts")  # Reference to User model
    date = models.DateField()  # Date of the workout
    duration = models.PositiveIntegerField()  # Duration in minutes
    notes = models.TextField(blank=True, null=True)  # Optional notes
    created_at = models.DateTimeField(auto_now_add=True)  # Automatically set on creation
    updated_at = models.DateTimeField(auto_now=True)  # Automatically set on update

    class Meta:
        indexes = [
            models.Index(fields=['user', '-date']),  # Equivalent of { userId: 1, date: -1 }
        ]
        ordering = ['-date']  # Default ordering by date descending

    def __str__(self):
        return f"Workout for {self.user.username} on {self.date}"

class Exercise(models.Model):
    name = models.CharField(max_length=255, blank=False, null=False)
    type = models.CharField(max_length=255, blank=False, null=False)
    description = models.TextField(blank=False, null=False)
    category = models.CharField(max_length=255, blank=False, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class WorkoutExercise(models.Model):
    workout = models.ForeignKey('Workout', on_delete=models.CASCADE, related_name='workout_exercises')
    exercise = models.ForeignKey('Exercise', on_delete=models.CASCADE, related_name='exercise_workouts')
    sets = models.PositiveIntegerField()
    reps = models.PositiveIntegerField()
    weight = models.FloatField(help_text="Weight in kilograms")

    def __str__(self):
        return f"{self.workout} - {self.exercise} ({self.sets} sets of {self.reps} reps)"

    class Meta:
        ordering = ['workout', 'exercise']
        unique_together = ('workout', 'exercise')
    
class WorkoutPlan(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='workout_plans')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    duration = models.PositiveIntegerField(help_text='Duration in weeks')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class WorkoutPlanExercise(models.Model):
    workout_plan = models.ForeignKey(WorkoutPlan, on_delete=models.CASCADE, related_name='exercises')
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    sets = models.PositiveIntegerField()
    reps = models.PositiveIntegerField()

class Challenge(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    participants = models.ManyToManyField(User, related_name='challenges')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title