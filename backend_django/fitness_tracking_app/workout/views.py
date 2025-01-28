from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from fitness_tracking_app.serializers import WorkoutSerializer
from fitness_tracking_app.models import Workout

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