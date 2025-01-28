from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from fitness_tracking_app.serializers import ProgressTrackingSerializer
from fitness_tracking_app.models import ProgressTracking

class ProgressTrackingListCreateView(APIView):
    """
    View to list all progress tracking records for the authenticated user and create new progress tracking records.
    Supports searching by notes and filtering by date range.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """
        List all progress tracking records, with optional filtering by notes (search) and date range.
        """
        user = request.user
        search = request.query_params.get('search', None)
        start_date = request.query_params.get('startDate', None)
        end_date = request.query_params.get('endDate', None)

        query = ProgressTracking.objects.filter(user=user)

        # Filtering by search term in notes
        if search:
            query = query.filter(notes__icontains=search)

        # Filtering by date range
        if start_date:
            query = query.filter(date__gte=start_date)
        if end_date:
            query = query.filter(date__lte=end_date)

        serializer = ProgressTrackingSerializer(query, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """
        Create a new progress tracking record for the authenticated user.
        """
        serializer = ProgressTrackingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProgressTrackingDetailView(APIView):
    """
    View to retrieve, update, or delete a specific progress tracking record.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        """
        Retrieve a specific progress tracking record.
        """
        try:
            progress = ProgressTracking.objects.get(pk=pk, user=request.user)
        except ProgressTracking.DoesNotExist:
            return Response({"error": "Progress tracking not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProgressTrackingSerializer(progress)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        """
        Update a specific progress tracking record.
        """
        try:
            progress = ProgressTracking.objects.get(pk=pk, user=request.user)
        except ProgressTracking.DoesNotExist:
            return Response({"error": "Progress tracking not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProgressTrackingSerializer(progress, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """
        Delete a specific progress tracking record.
        """
        try:
            progress = ProgressTracking.objects.get(pk=pk, user=request.user)
        except ProgressTracking.DoesNotExist:
            return Response({"error": "Progress tracking not found"}, status=status.HTTP_404_NOT_FOUND)

        progress.delete()
        return Response({"message": "Progress tracking deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
