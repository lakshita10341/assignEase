from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .permissions import IsReviewer

from .assignmentSerializer import AddAssignmentSerializer
from .models import Assignments

class CreateAssignmentView(generics.CreateAPIView):
    queryset = Assignments.objects.all()
    serializer_class = AddAssignmentSerializer
    permission_classes=[IsAuthenticated, IsReviewer]