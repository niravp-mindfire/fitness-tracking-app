from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from fitness_tracking_app.serializers import WorkoutPlanSerializer
from fitness_tracking_app.models import WorkoutPlan
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView

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