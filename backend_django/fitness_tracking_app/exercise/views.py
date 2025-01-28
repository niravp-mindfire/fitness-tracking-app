from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from fitness_tracking_app.serializers import ExerciseSerializer
from fitness_tracking_app.models import Exercise
from django.db.models import Q

class ExercisePagination(PageNumberPagination):
    """
    Custom pagination class for exercises to limit the number of exercises per page.
    Allows the user to set their own page size with a maximum of 50 items per page.
    """
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50


class ExerciseListCreateView(ListCreateAPIView):
    """
    View to list all exercises and create new exercises.
    Supports filtering by search query, date range, and sorting.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ExerciseSerializer
    pagination_class = ExercisePagination

    def get_queryset(self):
        """
        Override the default queryset to include filtering, date range, and sorting.
        """
        queryset = Exercise.objects.all()

        # Filter exercises by name, type, or category using a search query parameter.
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(
                Q(name__icontains=search_query) |
                Q(type__icontains=search_query) |
                Q(category__icontains=search_query)
            )

        # Filter exercises by a date range using start_date and end_date.
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        if start_date and end_date:
            queryset = queryset.filter(created_at__range=[start_date, end_date])

        # Sort exercises by the specified ordering parameter (default is 'created_at').
        ordering = self.request.query_params.get('ordering', 'created_at')
        if ordering:
            queryset = queryset.order_by(ordering)

        return queryset

    def post(self, request, *args, **kwargs):
        """
        Handle POST requests for creating a new exercise.
        """
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ExerciseDetailView(RetrieveUpdateDestroyAPIView):
    """
    View to retrieve, update, or delete a specific exercise.
    """
    permission_classes = [permissions.IsAuthenticated]
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer

    def put(self, request, *args, **kwargs):
        """
        Handle PUT requests to update an exercise.
        """
        partial = kwargs.pop('partial', False)  # Determine if it's a partial update
        instance = self.get_object()
        serializer = self.serializer_class(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        """
        Handle DELETE requests to remove an exercise.
        """
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

