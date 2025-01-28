# Fitness Tracker API

This project is a fitness tracking application that allows users to manage their fitness goals, workouts, exercises, meal plans, challenges, nutrition tracking, and progress over time. The API is built using Django Rest Framework, and the front-end interacts with the API to provide a seamless experience for users.

## Features

- **User Management**: Allows users to register, authenticate, and manage their profile, including fitness goals.
- **Workout Management**: Create, update, and track workouts, including exercises and workout plans.
- **Exercise Management**: Allows users to manage and log exercises.
- **Nutrition Tracking**: Record and track nutrition meals, including food items and calories.
- **Challenges**: Create and participate in fitness challenges with other users.
- **Progress Tracking**: Track the user's fitness progress, including weight, measurements, and other metrics over time.

## Technologies Used

- **Backend**: Django, Django Rest Framework, JWT Authentication
- **Database**: SQLite (or any other database you prefer)
- **Frontend**: React (or any frontend framework connecting to this API)

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/fitness-tracker-api.git
cd fitness-tracker-api
```

````

### 2. Create a Virtual Environment

Make sure you have Python installed. Create a virtual environment to manage dependencies.

```bash
python -m venv venv
source venv/bin/activate  # On Windows, use 'venv\Scripts\activate'
```

### 3. Install Dependencies

Install the required Python packages using `pip`.

```bash
pip install -r requirements.txt
```

### 4. Database Setup

Run the following command to set up the database and apply migrations.

```bash
python manage.py migrate
```

### 5. Create a Superuser

To access the admin panel, create a superuser.

```bash
python manage.py createsuperuser
```

Follow the prompts to create the superuser.

### 6. Running the Development Server

Start the Django development server.

```bash
python manage.py runserver
```

The API should now be running at `http://127.0.0.1:8000/`.

## API Endpoints

The following are the key endpoints available in the API:

### Authentication & User

- **POST /api/auth/register/**: Register a new user.
- **POST /api/auth/login/**: Login to get a JWT token.
- **GET /api/user/profile/**: Get the user's profile data.
- **PUT /api/user/profile/**: Update the user's profile.

### Fitness Goals

- **GET /api/fitness-goals/**: Get all fitness goals.
- **POST /api/fitness-goals/**: Create a new fitness goal.
- **PUT /api/fitness-goals/{id}/**: Update an existing fitness goal.
- **DELETE /api/fitness-goals/{id}/**: Delete a fitness goal.

### Workouts

- **GET /api/workouts/**: Get a list of all workouts.
- **POST /api/workouts/**: Create a new workout.
- **GET /api/workouts/{id}/**: Get details of a specific workout.
- **PUT /api/workouts/{id}/**: Update a workout.
- **DELETE /api/workouts/{id}/**: Delete a workout.

### Exercises

- **GET /api/exercises/**: Get a list of all exercises.
- **POST /api/exercises/**: Create a new exercise.
- **GET /api/exercises/{id}/**: Get details of a specific exercise.
- **PUT /api/exercises/{id}/**: Update an exercise.
- **DELETE /api/exercises/{id}/**: Delete an exercise.

### Workout Plans

- **GET /api/workout-plans/**: Get all workout plans.
- **POST /api/workout-plans/**: Create a new workout plan.
- **PUT /api/workout-plans/{id}/**: Update a workout plan.
- **DELETE /api/workout-plans/{id}/**: Delete a workout plan.

### Challenges

- **GET /api/challenges/**: Get all challenges.
- **POST /api/challenges/**: Create a new challenge.
- **GET /api/challenges/{id}/**: Get details of a specific challenge.
- **PUT /api/challenges/{id}/**: Update a challenge.
- **DELETE /api/challenges/{id}/**: Delete a challenge.

### Nutrition

- **GET /api/nutrition/**: Get all nutrition entries.
- **POST /api/nutrition/**: Create a new nutrition entry.
- **GET /api/nutrition/{id}/**: Get details of a specific nutrition entry.
- **PUT /api/nutrition/{id}/**: Update a nutrition entry.
- **DELETE /api/nutrition/{id}/**: Delete a nutrition entry.

### Progress Tracking

- **GET /api/progress-tracking/**: Get all progress tracking entries.
- **POST /api/progress-tracking/**: Create a new progress tracking entry.
- **GET /api/progress-tracking/{id}/**: Get details of a specific progress tracking entry.
- **PUT /api/progress-tracking/{id}/**: Update a progress tracking entry.
- **DELETE /api/progress-tracking/{id}/**: Delete a progress tracking entry.

## Usage

- **Create a User**: Use the `POST /api/auth/register/` endpoint to register a user and save their profile and fitness goals.
- **Track Progress**: Add workouts, exercises, and progress tracking data to keep track of fitness goals and nutrition.
- **Join Challenges**: Participate in fitness challenges by joining using the `Challenge` model.

## Testing

To run tests for the API, use the following command:

```bash
python manage.py test
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributions

Feel free to fork and submit pull requests to improve this project. Issues and feature requests can be raised through GitHub.

---

### **Important Notes:**

- The project assumes you are familiar with Django and Django Rest Framework for building APIs.
- JWT is used for authentication, so ensure you pass the token in the Authorization header for any endpoint requiring authentication.
- You can manage the database through the Django admin panel at `http://127.0.0.1:8000/admin/` using the superuser credentials.

```

This `README.md` provides all the essential details about your fitness tracker API project. It includes setup instructions, API endpoints, features, technologies used, and guidelines for contributing and testing.
```
````
