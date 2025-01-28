from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.views import APIView
from fitness_tracking_app.serializers import NutritionSerializer, NutritionMealSerializer, NutritionMealCreateUpdateSerializer
from fitness_tracking_app.models import Nutrition, NutritionMeal

class NutritionPagination(PageNumberPagination):
    """
    Custom pagination for nutrition entries, allowing clients to control page size with a maximum of 50 items per page.
    """
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50

class NutritionListCreateView(ListCreateAPIView):
    """
    View to list all nutrition records for the authenticated user and create new nutrition records.
    Supports filtering by date range.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NutritionSerializer
    pagination_class = NutritionPagination

    def get_queryset(self):
        """
        Override the default queryset to include filtering by date range.
        """
        queryset = Nutrition.objects.filter(user=self.request.user)

        # Filtering by date range
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        if start_date and end_date:
            queryset = queryset.filter(date__range=[start_date, end_date])

        return queryset

    def perform_create(self, serializer):
        """
        Override the perform_create method to associate the nutrition record with the authenticated user.
        """
        serializer.save(user=self.request.user)

class NutritionDetailView(RetrieveUpdateDestroyAPIView):
    """
    View to retrieve, update, or delete a specific nutrition record for the authenticated user.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NutritionSerializer

    def get_queryset(self):
        """
        Override the default queryset to return only the nutrition records belonging to the authenticated user.
        """
        return Nutrition.objects.filter(user=self.request.user)

class NutritionMealListCreateView(APIView):
    """
    View to list all nutrition meals and create a new nutrition meal.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """
        List all nutrition meals.
        """
        meals = NutritionMeal.objects.all()
        serializer = NutritionMealSerializer(meals, many=True)
        return Response(serializer.data)

    def post(self, request):
        """
        Create a new nutrition meal.
        """
        serializer = NutritionMealCreateUpdateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class NutritionMealDetailView(APIView):
    """
    View to retrieve, update, or delete a specific nutrition meal.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        """
        Retrieve a specific nutrition meal by its ID.
        """
        try:
            meal = NutritionMeal.objects.get(pk=pk)
        except NutritionMeal.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = NutritionMealSerializer(meal)
        return Response(serializer.data)

    def put(self, request, pk):
        """
        Update a specific nutrition meal by its ID.
        """
        try:
            meal = NutritionMeal.objects.get(pk=pk)
        except NutritionMeal.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = NutritionMealCreateUpdateSerializer(meal, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """
        Delete a specific nutrition meal by its ID.
        """
        try:
            meal = NutritionMeal.objects.get(pk=pk)
        except NutritionMeal.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        meal.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
