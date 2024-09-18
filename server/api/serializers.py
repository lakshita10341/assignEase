
from rest_framework import serializers
from .models import User,  Channels, Member, Assignments, Task, Group, Group_submission, Comments

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','password','email','bio','avatar']

class ChannelSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    class Meta:
        model = Channels
        fields =['id','channelName','created_by','created_at']

class MemberSerializer(serializers.ModelSerializer):
    member = UserSerializer(read_only =True)
    channel_id = ChannelSerializer(read_only =True)
    
    class Meta:
        model = Member
        fields = ['id','member','channel_id','is_moderator','is_reviewer','is_student']

class AssignmentSerializer(serializers.ModelSerializer):
    creator_id = MemberSerializer(read_only=True)
    fellow_reviewers = MemberSerializer(read_only=True)

    class Meta:
        model = Assignments
        fields = ['id','creator_id','title','description','created_at','deadline','attachments','fellow_reviewers','is_individual','students']

class GroupSerializer:
    assignment_id = AssignmentSerializer(read_only=True)
    student_id = MemberSerializer(read_only=True)

    class Meta:
        model = Group
        fields = ['id','assignment_id','student_id']

class TaskSerializer:
    assignment_id = AssignmentSerializer(read_only=True)

    class Meta:
        model = Task
        fields = ['id','assignment_id','title','description','deadline','attachments']

class GroupSubmSerializer:
    group_id = GroupSerializer(read_only=True)
    task_id = TaskSerializer(read_only=True)

    class Meta:
        model = Group_submission
        fields = ['id','attachment','status','submit_date','group_id','task_id']

class CommentSerializer:
    submit_id = GroupSubmSerializer(read_only=True)
    reviewer_id = MemberSerializer(read_only=True)

    class Meta:
        model = Comments
        fields = ['id','comment','submit_id','reviewer_id','reviewed_date']






