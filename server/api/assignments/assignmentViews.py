from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from ..permissions import IsReviewer

from .assignmentSerializer import AddAssignmentSerializer, GroupsSerializer
from ..models import Assignments, Group

class CreateAssignmentView(generics.CreateAPIView):
    queryset = Assignments.objects.all()
    serializer_class = AddAssignmentSerializer
    permission_classes=[IsAuthenticated, IsReviewer]

class AddStudents(generics.CreateAPIView):
    queryset = Group.objects.all()
    serializer_class =GroupsSerializer
    permission_classes = [IsAuthenticated]


    