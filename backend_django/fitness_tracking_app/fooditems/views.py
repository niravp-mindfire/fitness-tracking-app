from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from fitness_tracking_app.serializers import FoodItemSerializer
from fitness_tracking_app.models import FoodItem
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView

class FoodItemPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50

class FoodItemListCreateView(ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = FoodItemSerializer
    pagination_class = FoodItemPagination

    def get_queryset(self):
        queryset = FoodItem.objects.all()

        # Filtering
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(name__icontains=search_query)

        # Sorting
        ordering = self.request.query_params.get('ordering', 'created_at')  # Default sort by created_at
        if ordering:
            queryset = queryset.order_by(ordering)

        return queryset

class FoodItemDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = FoodItemSerializer

    def get_queryset(self):
        return FoodItem.objects.all()