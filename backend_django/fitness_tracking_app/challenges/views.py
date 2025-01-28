from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from fitness_tracking_app.serializers import ChallengeSerializer
from fitness_tracking_app.models import Challenge
from django.db.models import Q

class ChallengePagination(PageNumberPagination):
    """
    Custom pagination class to limit the number of challenges per page.
    Allows the user to set their own page size with a maximum of 50 items per page.
    """
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50


class ChallengeListCreateView(ListCreateAPIView):
    """
    View to list all challenges and create new challenges.
    Supports filtering by search query, date range, and sorting.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ChallengeSerializer
    pagination_class = ChallengePagination

    def get_queryset(self):
        """
        Override the default queryset to include filtering, date range, and sorting.
        """
        queryset = Challenge.objects.all()

        # Filter challenges by title or description using a search query parameter.
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) |
                Q(description__icontains=search_query)
            )

        # Filter challenges by a date range using start_date and end_date.
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        if start_date and end_date:
            queryset = queryset.filter(start_date__gte=start_date, end_date__lte=end_date)

        # Sort challenges by the specified ordering parameter (default is 'created_at').
        ordering = self.request.query_params.get('ordering', 'created_at')
        if ordering:
            queryset = queryset.order_by(ordering)

        return queryset

    def perform_create(self, serializer):
        """
        Override perform_create to add the user (request user) as the owner of the challenge.
        This ensures that the challenge is linked to the authenticated user.
        """
        serializer.save(owner=self.request.user)


class ChallengeDetailView(RetrieveUpdateDestroyAPIView):
    """
    View to retrieve, update, or delete a specific challenge.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ChallengeSerializer

    def get_queryset(self):
        """
        Returns the queryset of challenges to retrieve or modify.
        """
        return Challenge.objects.all()

    def perform_update(self, serializer):
        """
        Override perform_update to handle any custom logic during update (e.g., updating timestamps).
        """
        serializer.save()

    def perform_destroy(self, instance):
        """
        Override perform_destroy to handle any custom logic during deletion (e.g., logging).
        """
        instance.delete()

