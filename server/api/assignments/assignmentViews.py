from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..permissions import  IsAssignmentReviewer, IsCreatorOrReviewer
from ..serializers import ProfileSerializer
from .assignmentSerializer import AddAssignmentSerializer, AssignmentSerializer, ChangeStatusSerializer, CommentSerializer, GetAssignmentStudents, GetCommentSerializer, GroupAssignmentSerializer, GroupsSerializer,  SubmissionSerializer, SubmitAssignmentSerializer, AddReviewerSerializer
from ..models import Assignments, Comments, Group, Member, Submission
from uuid import UUID

class CreateAssignmentView(generics.CreateAPIView):
    queryset = Assignments.objects.all()
    serializer_class = AddAssignmentSerializer
    permission_classes=[IsAuthenticated, IsCreatorOrReviewer]

class AddStudents(generics.CreateAPIView):
    queryset = Group.objects.all()
    serializer_class =GroupsSerializer
    permission_classes = [IsAuthenticated, IsAssignmentReviewer]

class AddReviewers(generics.CreateAPIView):
    queryset=Assignments.objects.all()
    serializer_class=AddReviewerSerializer
    permission_classes=[IsAuthenticated,IsCreatorOrReviewer]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        assignment_id = serializer.validated_data['assignment_id']
        reviewer_ids = serializer.validated_data['reviewers_id']
        channel_id = self.request.query_params.get('channel_id')
        

        try:
            assignment = Assignments.objects.get(assignment_id=assignment_id.assignment_id, channel_id=channel_id)
            for reviewer in reviewer_ids:
                assignment.reviewers_id.add(reviewer)
        except Assignments.DoesNotExist:
            return Response({
                'message': 'Assignment does not exist',
            }, status=status.HTTP_404_NOT_FOUND)   

        return Response({
            'message': 'Reviewers added successfully',
        }, status=status.HTTP_200_OK)

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
        assignments = Assignments.objects.filter(reviewers_id=reviewer)
       
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
    permission_classes=[IsAuthenticated, IsAssignmentReviewer]
    serializer_class=CommentSerializer

class GetSubmission(generics.ListAPIView):
    queryset = Submission.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = SubmissionSerializer

    def list(self, request, *args, **kwargs):
  
        group_id = request.query_params.get('group_id')
        assignment_id = request.query_params.get('assignment_id')

        if group_id and assignment_id:
            submissions = self.queryset.filter(group_id=group_id, assignment_id=assignment_id)

            
            serializer = self.get_serializer(submissions, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        
        return Response({"message": "Please provide both group_id and assignment_id."}, status=status.HTTP_400_BAD_REQUEST)


    
class GetComments(generics.ListAPIView):
    queryset=Comments.objects.all()
    permission_classes=[IsAuthenticated]
    serializer_class=GetCommentSerializer

    def get_queryset(self):
        submit_id=self.request.query_params.get('submit_id')
        comments=Comments.objects.filter(submit_id=submit_id)
        return comments
        
class GetAssignedStudents(generics.ListAPIView):
    queryset=Group.objects.all()
    permission_classes=[IsAuthenticated, IsAssignmentReviewer]
    serializer_class=GetAssignmentStudents
    def get_queryset(self):
        assignment_id=self.request.query_params.get('assignment_id')
        students = Group.objects.filter(assignment_id=assignment_id)
        return students

class ChangeStatus(generics.UpdateAPIView):
    queryset=Group.objects.all()
    permission_classes=[IsAuthenticated, IsAssignmentReviewer]
    serializer_class=ChangeStatusSerializer
    
    def patch(self, request, *args, **kwargs):
        group_id = request.data.get('group_id')
        
        if not group_id:
            return Response({"error": "group_id is required in the payload"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            group = Group.objects.get(group_id=group_id)
        except Group.DoesNotExist:
            return Response({"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(group, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    