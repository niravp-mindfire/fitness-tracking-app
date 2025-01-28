from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from fitness_tracking_app.serializers import WorkoutExerciseSerializer
from fitness_tracking_app.models import WorkoutExercise
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from django.db.models import Q


# Pagination class
class WorkoutExercisePagination(PageNumberPagination):
    """
    Custom pagination for workout exercises.
    Allows users to specify the page size with the 'page_size' query parameter, with a maximum size of 50 items per page.
    """
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50


# List and Create View
class WorkoutExerciseListCreateView(ListCreateAPIView):
    """
    View to list all workout exercises or create a new workout exercise for the authenticated user.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = WorkoutExerciseSerializer
    pagination_class = WorkoutExercisePagination

    def get_queryset(self):
        """
        Get the list of workout exercises for the authenticated user, with optional filters and sorting.
        """
        queryset = WorkoutExercise.objects.filter(workout__user=self.request.user)  # Ensure only the current user's data

        # Filtering by search query
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
        """
        Create a new workout exercise and associate it with the authenticated user.
        """
        request.data['workout'] = request.data.get('workout')  # Ensure the workout is passed correctly
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Retrieve, Update, Delete View
class WorkoutExerciseDetailView(RetrieveUpdateDestroyAPIView):
    """
    View to retrieve, update, or delete a workout exercise for the authenticated user.
    """
    permission_classes = [permissions.IsAuthenticated]
    queryset = WorkoutExercise.objects.all()
    serializer_class = WorkoutExerciseSerializer

    def get_object(self):
        """
        Retrieve the workout exercise associated with the authenticated user.
        """
        workout_exercise = super().get_object()
        if workout_exercise.workout.user != self.request.user:  # Ensure the workout belongs to the user
            raise PermissionDenied("You do not have permission to access this workout exercise.")
        return workout_exercise

    def put(self, request, *args, **kwargs):
        """
        Update an existing workout exercise.
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.serializer_class(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        """
        Delete a specific workout exercise.
        """
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
