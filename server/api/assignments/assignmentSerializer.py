from xml.dom import ValidationErr
from django.forms import ValidationError
from requests import Request, Response
from rest_framework import serializers, status
from ..models import Assignments, Channels, Group, Member, Submission, Comments
from ..serializers import MemberSerializer, ProfileSerializer

from django.core.mail import send_mail

class AddAssignmentSerializer(serializers.ModelSerializer):
    attachments = serializers.FileField(
        allow_empty_file = True,
        required =False,
    )
    deadline = serializers.DateField(format="%Y-%m-%d", input_formats=["%Y-%m-%d", "%Y-%m-%dT%H:%M:%S.%fZ", "%Y-%m-%dT%H:%M:%S.%f"])  # Adjust input formats

    class Meta:
        model = Assignments
        fields = ['channel_id','title','description','deadline','attachments']
        extra_kwargs={
            'assignment_id': {"read_only" : True},
        }

    def create(self, validated_data):
        attachments = validated_data.pop('attachments', None)
        user_id = self.context['request'].user.id
        
        title = validated_data.get('title')
        description = validated_data.get('description')
        deadline = validated_data.get('deadline')  

   
        channel_id = validated_data.get('channel_id')
        creator_id = Member.objects.get(memberName = user_id,channel_id=channel_id)

        assignment = Assignments.objects.create(
            creator_id=creator_id,
            title = title,
            description = description,
            deadline = deadline,  
            
            channel_id=channel_id,       
        )
        assignment.reviewers_id.add(creator_id)
        if attachments:
            assignment.attachments = attachments
            assignment.save()
        return assignment
    
class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignments
        fields = ['assignment_id','title','description','deadline','attachments']

    
class GroupSerializer(serializers.ModelSerializer):
    # student_ids = MemberSerializer()
    student_id = serializers.ListField(
        child=serializers.UUIDField(),  
        write_only=True
    )

    class Meta:
        model = Group
        fields = ['student_id']

class AddReviewerSerializer(serializers.ModelSerializer):
    assignment_id = serializers.PrimaryKeyRelatedField(queryset=Assignments.objects.all(), write_only=True)
    reviewers_id = serializers.ListField(
        child=serializers.PrimaryKeyRelatedField(queryset=Member.objects.all()),
        write_only=True
    )
    class Meta:
        model=Assignments
        fields=['assignment_id','reviewers_id']
    
    


class GroupsSerializer(serializers.ModelSerializer):
    assignment_id = serializers.PrimaryKeyRelatedField(queryset=Assignments.objects.all(), write_only=True)
    Group= GroupSerializer(many=True, write_only = True)
    

    class Meta:
        model = Group
        fields = ['assignment_id','Group']
        extra_kwargs = {
            'group_id' : {'read_only': True},
        }
    
    def create(self,validated_data):
        Groups = validated_data.get('Group')
        assignment_id = validated_data.get('assignment_id')
    
        try:
            assignment = Assignments.objects.get(assignment_id=assignment_id.assignment_id)
        except Assignments.DoesNotExist:
            raise ValidationErr({'message': f"Assignment {assignment_id} doesn't exist"})
        created_group=[]
        student_emails=[]
        for GroupData in Groups:
            students = []
            student_ids = GroupData.get('student_id')
            for student in student_ids:
                
                try:
                    student_data = Member.objects.get(memberid = student)
                    if not student_data.is_student:
                        print(f"{student} is not a student")
                    else:
                        print(student_data.memberName)
                        student_emails.append(student_data.memberName.email)
                        students.append(student_data)
                except Member.DoesNotExist:
                    raise serializers.ValidationError({'message': f"Student with {student} doesn't exist"})
            group = Group.objects.create(assignment_id=assignment)
            group.student_id.set(students)
            group.save()
            created_group.append(group)  
        subject = f"New Assignment: "
        message = (
        f"Dear Students,\n\n"
        f"A new assignment has been added. "
        f"Please check and submit it before the due date.\n\n"
        f"Best regards,\n"
    )
        
        try:
      
            send_mail(
            subject=subject,
            message=message,
            from_email='', 
            recipient_list=student_emails,  
            fail_silently=False,
            )
            print("Emails sent successfully!")
        except Exception as e:
            print(f"Failed to send emails: {e}")
        return created_group

class StudentSerializer(serializers.ModelSerializer):
    memberName = ProfileSerializer(read_only=True)
    class Meta:
        model = Member
        fields = ['memberid','memberName']           

class GroupAssignmentSerializer(serializers.ModelSerializer):
    assignment_id = AssignmentSerializer(read_only=True)
    class Meta:
        model = Group
        fields =['group_id','assignment_id','status']

class SubmitAssignmentSerializer(serializers.ModelSerializer):              
    class Meta:
        model = Submission
        fields = ['group_id','assignment_id','submission_text','submission_file']
    def create(self,validated_data):
        return Submission.objects.create(
                group_id=validated_data.get('group_id'),
                assignment_id=validated_data.get('assignment_id'),
                submission_text=validated_data.get('submission_text'),
                submission_file=validated_data.get('submission_file')
            )

class GetCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model=Comments
        fields=['c_id','submit_id','comment','reviewer_id','reviewer_date']

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comments
        fields = ['submit_id','comment']
    def create(self,validated_data):
        
        user = self.context['request'].user
        channel_id = self.context['request'].data.get('channel_id')
        print(user.id)
        print(channel_id)
        try:
            channel = Channels.objects.get(channelid=channel_id)
           
        except Channels.DoesNotExist:
            raise ValidationError("Channel doesn't exist.")
        try:
            reviewer_id = Member.objects.get(channel_id=channel, memberName=user.id)
        except Member.DoesNotExist:
            raise ValidationError("Reviewer not found for the specified channel and user.")
        
        return Comments.objects.create(
            submit_id=validated_data.get('submit_id'),
            comment = validated_data.get('comment'),
            reviewer_id=reviewer_id,
        )
class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = [
            'submission_id',
            'submission_text',
            'submission_file',
            'submit_date'
        ]

class GetAssignmentStudents(serializers.ModelSerializer):
    usernames = serializers.SerializerMethodField()
    assignment_id=AssignmentSerializer(read_only=True)
    class Meta:
        model = Group
        fields = ['group_id', 'assignment_id', 'score', 'status', 'usernames']

    def get_usernames(self, obj):
        # Access the related 'student_id' (Members) and get the usernames of the related 'User'
        return [student.memberName.username for student in obj.student_id.all()]

 
class ChangeStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['status']   




      
