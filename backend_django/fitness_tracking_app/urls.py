# user_management/urls.py
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterUser, LoginUser, EditProfile, GetMyProfile, ForgetPassword, ResetPassword
from .workout.views import GetAllWorkouts, GetWorkoutById, CreateWorkout, EditWorkout, DeleteWorkout 
from .exercise.views import ExerciseListCreateView, ExerciseDetailView
from .workoutexercise.views import WorkoutExerciseListCreateView, WorkoutExerciseDetailView
from .workoutplans.views import WorkoutPlanListCreateView, WorkoutPlanDetailView
from .challenges.views import ChallengeListCreateView, ChallengeDetailView
from .fooditems.views import FoodItemListCreateView, FoodItemDetailView
from .nutrition.views import NutritionListCreateView, NutritionDetailView, NutritionMealListCreateView, NutritionMealDetailView
from .progresstracking.views import ProgressTrackingListCreateView, ProgressTrackingDetailView

urlpatterns = [
    path('token', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('register', RegisterUser.as_view(), name='register_user'),
    path('login', LoginUser.as_view(), name='login_user'),
    path('edit-profile', EditProfile.as_view(), name='edit_profile'),
    path('my-profile', GetMyProfile.as_view(), name='get_my_profile'),
    path('forget-password', ForgetPassword.as_view(), name='forget_password'),
    path('reset-password/<str:reset_token>', ResetPassword.as_view(), name='reset_password'),

    #workout
    path('workouts', GetAllWorkouts.as_view(), name='get_all_workouts'),
    path('workouts/<int:workout_id>', GetWorkoutById.as_view(), name='get_workout_by_id'),
    path('workouts/create', CreateWorkout.as_view(), name='create_workout'),
    path('workouts/edit/<int:workout_id>', EditWorkout.as_view(), name='edit_workout'),
    path('workouts/delete/<int:workout_id>', DeleteWorkout.as_view(), name='delete_workout'),

    path('exercises', ExerciseListCreateView.as_view(), name='exercise_list_create'),
    path('exercises/<int:pk>', ExerciseDetailView.as_view(), name='exercise_detail'),

    path('workout-exercises', WorkoutExerciseListCreateView.as_view(), name='workout_exercise_list_create'),
    path('workout-exercises/<int:pk>', WorkoutExerciseDetailView.as_view(), name='workout_exercise_detail'),

    path('workout-plans', WorkoutPlanListCreateView.as_view(), name='workout_plan_list_create'),
    path('workout-plans/<int:pk>', WorkoutPlanDetailView.as_view(), name='workout_plan_detail'),

    path('challenges', ChallengeListCreateView.as_view(), name='challenge_list_create'),
    path('challenges/<int:pk>', ChallengeDetailView.as_view(), name='challenge_detail'),

    path('food-items', FoodItemListCreateView.as_view(), name='food_item_list_create'),
    path('food-items/<int:pk>', FoodItemDetailView.as_view(), name='food_item_detail'),

    path('nutrition', NutritionListCreateView.as_view(), name='nutrition_list_create'),
    path('nutrition/<int:pk>', NutritionDetailView.as_view(), name='nutrition_detail'),

    path('nutrition-meals/', NutritionMealListCreateView.as_view(), name='nutrition_meal_list_create'),
    path('nutrition-meals/<int:pk>/', NutritionMealDetailView.as_view(), name='nutrition_meal_detail'),

     path('progress-tracking/', ProgressTrackingListCreateView.as_view(), name='progress-tracking-list-create'),
    path('progress-tracking/<int:pk>/', ProgressTrackingDetailView.as_view(), name='progress-tracking-detail'),
]
