from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..permissions import IsReviewer
from ..serializers import ProfileSerializer
from .assignmentSerializer import AddAssignmentSerializer, AssignmentSerializer, CommentSerializer, GetAssignmentStudents, GroupAssignmentSerializer, GroupsSerializer,  SubmissionSerializer, SubmitAssignmentSerializer
from ..models import Assignments, Comments, Group, Member, Submission


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
    
class GetAssignmentAsStudents(generics.ListAPIView):
    queryset=Group.objects.all()
    serializer_class=GroupAssignmentSerializer
    permission_classes=[IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        member = Member.objects.get(memberName=user)
        groups = Group.objects.filter(student_id=member)
        channel_id= self.request.query_params.get('channel_id')
        if channel_id:
            groups = groups.filter(assignment_id__channel_id=channel_id)
        return groups
      
class SubmitAssignment(generics.CreateAPIView):
    permission_classes=[IsAuthenticated]  
    serializer_class=SubmitAssignmentSerializer     
    
class Comment(generics.CreateAPIView):
    permission_classes=[IsAuthenticated, IsReviewer]
    serializer_class=CommentSerializer

class GetSubmission(generics.ListAPIView):
    queryset = Submission.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = SubmissionSerializer

    def list(self, request, *args, **kwargs):
        # Get group_id and assignment_id from query parameters
        group_id = request.query_params.get('group_id')
        assignment_id = request.query_params.get('assignment_id')

        # Check if both parameters are provided
        if group_id and assignment_id:
            submissions = self.queryset.filter(group_id=group_id, assignment_id=assignment_id)

            # Serialize the filtered submissions
            serializer = self.get_serializer(submissions, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # Return a bad request response if parameters are missing
        return Response({"message": "Please provide both group_id and assignment_id."}, status=status.HTTP_400_BAD_REQUEST)


    
class GetComments(generics.ListAPIView):
    queryset=Comments.objects.all()
    permission_classes=[IsAuthenticated]
    serializer_class=CommentSerializer

    def post(self,request):
        submit_id=request.data.get('submit_id')
        comments=Comment.objects.filter(submit_id=submit_id)
        serializer=self.serializer_class(comments,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
class GetAssignedStudents(generics.ListAPIView):
    queryset=Group.objects.all()
    permission_classes=[IsAuthenticated]
    serializer_class=GetAssignmentStudents
    def get_queryset(self):
        assignment_id=self.request.query_params.get('assignment_id')
        students = Group.objects.filter(assignment_id=assignment_id)
        return students
