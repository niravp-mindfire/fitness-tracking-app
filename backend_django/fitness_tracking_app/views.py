from django.contrib.auth import authenticate, login
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from .serializers import UserSerializer, UserProfileSerializer, FitnessGoalSerializer
from django.core.mail import send_mail
from django.conf import settings
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.tokens import PasswordResetTokenGenerator

class RegisterUser(APIView):
    """
    View to register a new user.
    Expects a POST request with user data.
    """
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Optionally generate tokens for the user here
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        # Handle validation errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginUser(APIView):
    """
    View to authenticate user with email and password.
    Returns JWT tokens upon successful authentication.
    """
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        # Attempt to find the user by email
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
        
        # Invalid credentials
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

class EditProfile(APIView):
    """
    View to allow users to edit their profile.
    This includes user data, profile data, and fitness goals.
    """
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

        # Update User fields if present
        if user_data:
            user_serializer = UserSerializer(user, data=user_data, partial=True)
            if user_serializer.is_valid():
                user_serializer.save()
            else:
                return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Update UserProfile fields if present
        if profile_data:
            profile_serializer = UserProfileSerializer(profile, data=profile_data, partial=True)
            if profile_serializer.is_valid():
                profile_serializer.save()
            else:
                return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Update FitnessGoals if present
        if fitness_goals_data:
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
    """
    View to get the authenticated user's profile.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        # Attempt to retrieve the user profile
        try:
            profile = user.userprofile
        except AttributeError:
            return Response({"error": "User profile is not configured properly"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except UserProfile.DoesNotExist:
            return Response({"error": "User profile does not exist"}, status=status.HTTP_404_NOT_FOUND)

        # Serialize and return the profile data
        profile_data = UserProfileSerializer(profile).data
        return Response({'profile': profile_data}, status=status.HTTP_200_OK)

class ForgetPassword(APIView):
    """
    View to send a password reset email with a token.
    """
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
    """
    View to reset the user's password using the reset token.
    """
    def post(self, request, reset_token):
        email = request.data.get('email')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')

        # Check if the passwords match
        if new_password != confirm_password:
            return Response({"error": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
            token_generator = PasswordResetTokenGenerator()

            # Validate the reset token
            if not token_generator.check_token(user, reset_token):
                return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

            # Reset the user's password
            user.set_password(new_password)
            user.save()
            return Response({"message": "Password reset successfully"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User with this email does not exist"}, status=status.HTTP_400_BAD_REQUEST)

