from rest_framework.test import APITestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from django.contrib.auth.models import User
from fitness_tracking_app.models import FitnessGoal, UserProfile

class AuthTestCase(APITestCase):

    def test_user_registration(self):
        url = reverse('register_user')  # URL should match the path defined in `urls.py`
        data = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'password123',
            'profile': {
                'first_name': 'Test',
                'last_name': 'User',
                'age': 25,
                'gender': 'Male',
                'height': 175.0,
                'weight': 70.0,
                'dob': '1999-01-01',
                'fitness_goals': []
            }
        }

        response = self.client.post(url, data, format='json')
        
        # Ensure the response status code is 201 (Created)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['message'], 'User registered successfully')

    def test_user_login(self):
        # First, create a user to log in
        user_data = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'password123',
            'profile': {
                'first_name': 'Test',
                'last_name': 'User',
                'age': 25,
                'gender': 'Male',
                'height': 175.0,
                'weight': 70.0,
                'dob': '1999-01-01',
                'fitness_goals': []
            }
        }

        # Register the user first
        self.client.post(reverse('register_user'), user_data, format='json')

        login_data = {
            'email': 'testuser@example.com',
            'password': 'password123'
        }
        url = reverse('login_user')  # URL should match the path defined in `urls.py`
        
        response = self.client.post(url, login_data, format='json')

        # Ensure the response status code is 200 (OK) and check for tokens
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access_token', response.data)
        self.assertIn('refresh_token', response.data)

    def test_invalid_login(self):
        # Try logging in with incorrect credentials
        login_data = {
            'email': 'invaliduser@example.com',
            'password': 'wrongpassword'
        }
        url = reverse('login_user')  # URL should match the path defined in `urls.py`

        response = self.client.post(url, login_data, format='json')

        # Ensure the response status code is 400 (Bad Request) and contains error details
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['detail'], 'Invalid credentials')

class GetMyProfileTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        # Create a test user
        self.user = User.objects.create_user(username="testuser", password="password123", email="testuser@example.com")

        # Create fitness goals
        goal = FitnessGoal.objects.create(goal_type="Lose Weight", target_value=70, current_value=80, target_date="2025-12-31")

        # Create a UserProfile for the user
        self.profile = UserProfile.objects.create(
            user=self.user,
            first_name="John",
            last_name="Doe",
            age=30,
            gender="Male",
            height=175.5,
            weight=80,
            dob="1994-05-10"
        )
        self.profile.fitness_goals.add(goal)

        # Log in to get the JWT token
        login_data = {'email': 'testuser@example.com', 'password': 'password123'}
        login_url = reverse('login_user')
        response = self.client.post(login_url, login_data, format='json')
        
        # Store the token in an instance variable
        self.token = response.data['access_token']

    def test_get_my_profile(self):
        url = '/api/my-profile'
        
        # Include the token in the request headers
        headers = {'Authorization': f'Bearer {self.token}'}
        response = self.client.get(url, headers=headers)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("profile", response.data)
        self.assertEqual(response.data["profile"]["first_name"], "John")
        self.assertEqual(response.data["profile"]["last_name"], "Doe")
        self.assertEqual(response.data["profile"]["age"], 30)
        self.assertEqual(response.data["profile"]["gender"], "Male")
        self.assertEqual(response.data["profile"]["height"], 175.5)
        self.assertEqual(response.data["profile"]["weight"], 80)
        self.assertEqual(response.data["profile"]["dob"], "1994-05-10")
        self.assertEqual(len(response.data["profile"]["fitness_goals"]), 1)
        self.assertEqual(response.data["profile"]["fitness_goals"][0]["goal_type"], "Lose Weight")
