# user_management/views.py
from django.contrib.auth import authenticate, login
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from .serializers import UserSerializer, UserProfileSerializer, FitnessGoalSerializer, WorkoutSerializer, ExerciseSerializer, WorkoutExerciseSerializer, WorkoutPlanSerializer, ChallengeSerializer
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.conf import settings
from rest_framework.pagination import PageNumberPagination
from .models import Workout, Exercise, WorkoutExercise, WorkoutPlan, Challenge
from datetime import datetime

from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from django.db.models import Q

class RegisterUser(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # You can optionally generate tokens here for the user if needed
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginUser(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        # Retrieve the username associated with the email
        try:
            user = User.objects.get(email=email)
            username = user.username
        except User.DoesNotExist:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

        # Authenticate using the username and password
        user = authenticate(username=username, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            return Response({'access_token': access_token, 'refresh_token': str(refresh)}, status=status.HTTP_200_OK)
        
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

class EditProfile(APIView):
    def put(self, request):
        user = request.user

        # Ensure user is authenticated and has a profile
        try:
            profile = user.userprofile
        except UserProfile.DoesNotExist:
            return Response({"error": "User profile does not exist"}, status=status.HTTP_404_NOT_FOUND)

        # Get user and profile data from the request
        user_data = request.data.get('user', {})
        profile_data = user_data.pop('profile', {})
        fitness_goals_data = profile_data.pop('fitness_goals', [])

        # Update User fields
        if user_data:
            user_serializer = UserSerializer(user, data=user_data, partial=True)
            if user_serializer.is_valid():
                user_serializer.save()
            else:
                return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Update UserProfile fields
        if profile_data:
            profile_serializer = UserProfileSerializer(profile, data=profile_data, partial=True)
            if profile_serializer.is_valid():
                profile_serializer.save()
            else:
                return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Update FitnessGoals
        if fitness_goals_data:
            # Clear existing goals and recreate them
            profile.fitness_goals.clear()
            for goal_data in fitness_goals_data:
                goal_serializer = FitnessGoalSerializer(data=goal_data)
                if goal_serializer.is_valid():
                    fitness_goal = goal_serializer.save()
                    profile.fitness_goals.add(fitness_goal)
                else:
                    return Response(goal_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Profile updated successfully"}, status=status.HTTP_200_OK)

class GetMyProfile(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        # Attempt to retrieve the user profile
        try:
            profile = user.userprofile  # Adjust 'userprofile' to match your related_name in the UserProfile model
        except AttributeError:
            return Response({"error": "User profile is not configured properly"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except UserProfile.DoesNotExist:
            return Response({"error": "User profile does not exist"}, status=status.HTTP_404_NOT_FOUND)

        # Serialize and return the profile
        profile_data = UserProfileSerializer(profile).data
        return Response({'profile': profile_data}, status=status.HTTP_200_OK)

class ForgetPassword(APIView):
    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
            token_generator = PasswordResetTokenGenerator()
            reset_token = token_generator.make_token(user)

            reset_url = f"{settings.FRONTEND_URL}/reset-password/{reset_token}"

            # Send the reset password email
            send_mail(
                subject="Reset Your Password",
                message=f"Use the link below to reset your password:\n{reset_url}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
            )

            return Response({"message": "Password reset email sent successfully"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User with this email does not exist"}, status=status.HTTP_400_BAD_REQUEST)

class ResetPassword(APIView):
    def post(self, request, reset_token):
        email = request.data.get('email')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')

        if new_password != confirm_password:
            return Response({"error": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
            token_generator = PasswordResetTokenGenerator()

            if not token_generator.check_token(user, reset_token):
                return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.save()
            return Response({"message": "Password reset successfully"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User with this email does not exist"}, status=status.HTTP_400_BAD_REQUEST)

class WorkoutPagination(PageNumberPagination):
    page_size = 10  # Define the number of items per page
    page_size_query_param = 'page_size'
    max_page_size = 100


class GetAllWorkouts(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        workouts = Workout.objects.all()

        # Search filter
        search = request.query_params.get('search', None)
        if search:
            workouts = workouts.filter(notes__icontains=search)

        # Date filter
        start_date = request.query_params.get('start_date', None)
        end_date = request.query_params.get('end_date', None)
        if start_date:
            workouts = workouts.filter(date__gte=datetime.strptime(start_date, '%Y-%m-%d'))
        if end_date:
            workouts = workouts.filter(date__lte=datetime.strptime(end_date, '%Y-%m-%d'))

        # Pagination
        paginator = WorkoutPagination()
        result_page = paginator.paginate_queryset(workouts, request)
        serializer = WorkoutSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)


class GetWorkoutById(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, workout_id):
        try:
            workout = Workout.objects.get(id=workout_id)
            serializer = WorkoutSerializer(workout)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Workout.DoesNotExist:
            return Response({"detail": "Workout not found"}, status=status.HTTP_404_NOT_FOUND)


class CreateWorkout(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        # Automatically assign the authenticated user to the workout
        request.data['user'] = request.user.id
        
        serializer = WorkoutSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EditWorkout(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, workout_id):
        try:
            workout = Workout.objects.get(id=workout_id, user=request.user)  # Ensure user matches
            serializer = WorkoutSerializer(workout, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Workout.DoesNotExist:
            return Response({"detail": "Workout not found or unauthorized access"}, status=status.HTTP_404_NOT_FOUND)

class DeleteWorkout(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, workout_id):
        try:
            workout = Workout.objects.get(id=workout_id)
            workout.delete()
            return Response({"detail": "Workout deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Workout.DoesNotExist:
            return Response({"detail": "Workout not found"}, status=status.HTTP_404_NOT_FOUND)

class ExercisePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50

class ExerciseListCreateView(ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ExerciseSerializer
    pagination_class = ExercisePagination

    def get_queryset(self):
        queryset = Exercise.objects.all()

        # Filtering
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(
                Q(name__icontains=search_query) |
                Q(type__icontains=search_query) |
                Q(category__icontains=search_query)
            )

        # Date filtering
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        if start_date and end_date:
            queryset = queryset.filter(created_at__range=[start_date, end_date])

        # Sorting
        ordering = self.request.query_params.get('ordering', 'created_at')  # Default sort by created_at
        if ordering:
            queryset = queryset.order_by(ordering)

        return queryset

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ExerciseDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer

    def put(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.serializer_class(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Pagination class
class WorkoutExercisePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50


# List and Create View
class WorkoutExerciseListCreateView(ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = WorkoutExerciseSerializer
    pagination_class = WorkoutExercisePagination

    def get_queryset(self):
        queryset = WorkoutExercise.objects.all()

        # Filtering
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(
                Q(workout__id__icontains=search_query) |
                Q(exercise__name__icontains=search_query)
            )

        # Date filtering
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        if start_date and end_date:
            queryset = queryset.filter(workout__created_at__range=[start_date, end_date])

        # Sorting
        ordering = self.request.query_params.get('ordering', 'id')  # Default sort by ID
        if ordering:
            queryset = queryset.order_by(ordering)

        return queryset

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Retrieve, Update, Delete View
class WorkoutExerciseDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = WorkoutExercise.objects.all()
    serializer_class = WorkoutExerciseSerializer

    def put(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.serializer_class(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class WorkoutPlanPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50

class WorkoutPlanListCreateView(ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = WorkoutPlanSerializer
    pagination_class = WorkoutPlanPagination

    def get_queryset(self):
        queryset = WorkoutPlan.objects.filter(user=self.request.user)

        # Filtering
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) |
                Q(description__icontains=search_query)
            )

        # Date filtering
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        if start_date and end_date:
            queryset = queryset.filter(created_at__range=[start_date, end_date])

        # Sorting
        ordering = self.request.query_params.get('ordering', 'created_at')  # Default sort by created_at
        if ordering:
            queryset = queryset.order_by(ordering)

        return queryset

class WorkoutPlanDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = WorkoutPlanSerializer

    def get_queryset(self):
        return WorkoutPlan.objects.filter(user=self.request.user)

class ChallengePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50

class ChallengeListCreateView(ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    serializer_class = ChallengeSerializer
    pagination_class = ChallengePagination

    def get_queryset(self):
        queryset = Challenge.objects.all()

        # Filtering
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) |
                Q(description__icontains=search_query)
            )

        # Date filtering
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        if start_date and end_date:
            queryset = queryset.filter(start_date__gte=start_date, end_date__lte=end_date)

        # Sorting
        ordering = self.request.query_params.get('ordering', 'created_at')  # Default sort by created_at
        if ordering:
            queryset = queryset.order_by(ordering)

        return queryset

class ChallengeDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    serializer_class = ChallengeSerializer

    def get_queryset(self):
        return Challenge.objects.all()