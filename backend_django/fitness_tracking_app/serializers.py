from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile, FitnessGoal, Workout, Exercise, WorkoutExercise, WorkoutPlan, WorkoutPlanExercise, Challenge

class FitnessGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = FitnessGoal
        fields = ['goal_type', 'target_value', 'current_value', 'target_date']


class UserProfileSerializer(serializers.ModelSerializer):
    fitness_goals = FitnessGoalSerializer(many=True)

    class Meta:
        model = UserProfile
        fields = [
            'first_name', 'last_name', 'age', 'gender', 
            'height', 'weight', 'dob', 'fitness_goals'
        ]

    def create(self, validated_data):
        fitness_goals_data = validated_data.pop('fitness_goals', [])
        profile = UserProfile.objects.create(**validated_data)
        for goal_data in fitness_goals_data:
            fitness_goal = FitnessGoal.objects.create(**goal_data)
            profile.fitness_goals.add(fitness_goal)
        return profile


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer()

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'profile']

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        user = User.objects.create_user(**validated_data)
        # Save UserProfile
        profile_data['user'] = user
        UserProfileSerializer().create(profile_data)
        return user

class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = ['id', 'user', 'date', 'duration', 'notes', 'created_at', 'updated_at']

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = '__all__'

class WorkoutExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutExercise
        fields = '__all__'

class WorkoutPlanExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutPlanExercise
        fields = ['exercise', 'sets', 'reps']

class WorkoutPlanSerializer(serializers.ModelSerializer):
    exercises = WorkoutPlanExerciseSerializer(many=True)

    class Meta:
        model = WorkoutPlan
        fields = ['id', 'user', 'title', 'description', 'duration', 'exercises', 'created_at', 'updated_at']

    def create(self, validated_data):
        exercises_data = validated_data.pop('exercises')
        workout_plan = WorkoutPlan.objects.create(**validated_data)
        for exercise_data in exercises_data:
            WorkoutPlanExercise.objects.create(workout_plan=workout_plan, **exercise_data)
        return workout_plan

    def update(self, instance, validated_data):
        exercises_data = validated_data.pop('exercises')
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.duration = validated_data.get('duration', instance.duration)
        instance.save()

        # Update exercises
        instance.exercises.all().delete()
        for exercise_data in exercises_data:
            WorkoutPlanExercise.objects.create(workout_plan=instance, **exercise_data)
        return instance

class ChallengeSerializer(serializers.ModelSerializer):
    participants = serializers.PrimaryKeyRelatedField(many=True, queryset=User.objects.all())

    class Meta:
        model = Challenge
        fields = ['id', 'title', 'description', 'start_date', 'end_date', 'participants', 'created_at', 'updated_at']

    def create(self, validated_data):
        participants = validated_data.pop('participants', [])
        challenge = Challenge.objects.create(**validated_data)
        challenge.participants.set(participants)
        return challenge

    def update(self, instance, validated_data):
        participants = validated_data.pop('participants', None)
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.start_date = validated_data.get('start_date', instance.start_date)
        instance.end_date = validated_data.get('end_date', instance.end_date)
        if participants is not None:
            instance.participants.set(participants)
        instance.save()
        return instance