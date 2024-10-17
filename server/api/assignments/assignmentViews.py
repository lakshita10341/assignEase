from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from ..permissions import IsReviewer
from ..serializers import ProfileSerializer
from .assignmentSerializer import AddAssignmentSerializer, AssignmentSerializer, GroupsSerializer
from ..models import Assignments, Group, Member


class CreateAssignmentView(generics.CreateAPIView):
    queryset = Assignments.objects.all()
    serializer_class = AddAssignmentSerializer
    permission_classes=[IsAuthenticated, IsReviewer]

class AddStudents(generics.CreateAPIView):
    queryset = Group.objects.all()
    serializer_class =GroupsSerializer
    permission_classes = [IsAuthenticated]

class GetStudents(generics.CreateAPIView):
    queryset = Member.objects.all()
    serializerClass = ProfileSerializer
    permission_classes=[IsAuthenticated]
    def get_queryset(self):
        channel_id = self.request.query_params.get('channel_id')
        students = Member.objects.filter(channel_id=channel_id, is_student=True)
        return students

class GetAssignmennts(generics.ListAPIView):
    queryset = Assignments.objects.all()
    serializer_class =AssignmentSerializer
    permission_classes=[IsAuthenticated]
    def get_queryset(self):
        channel_id = self.request.query_params.get('channelName')
        requestor = self.request.user
        reviewer = Member.objects.get(channel_id=channel_id, memberName = requestor)
        assignments = Assignments.objects.filter(creator_id=reviewer)
        print(assignments)
        return assignments

          


    