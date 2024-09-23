
from rest_framework import serializers
from .models import User,  Channels, Member, Assignments, Task, Group, Submission, Comments

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['userid','username','password','email','bio','avatar']
       
        
        def create(self,validated_data):
            print("Creating instance with data:", validated_data)
            password = validated_data.pop('password',None)
            user = self.Meta.model(**validated_data) 
            user.is_active = True
            if password is not None:
                
                user.set_password(password)
            else:
                print("Password is none")
            user.save()
            return user  


class ChannelSerializer(serializers.ModelSerializer):
    created_by = RegisterSerializer(read_only=True)
    class Meta:
        model = Channels
        fields =['channelid','channelName','created_by','created_at']

class MemberSerializer(serializers.ModelSerializer):
    member = RegisterSerializer(read_only =True)
    channel_id = ChannelSerializer(read_only =True)
    
    class Meta:
        model = Member
        fields = ['memberid','memberName','channel_id','is_moderator','is_reviewer','is_student']

class AssignmentSerializer(serializers.ModelSerializer):
    creator_id = MemberSerializer(read_only=True)
    fellow_reviewers = MemberSerializer(read_only=True)

    class Meta:
        model = Assignments
        fields = ['assignment_id','creator_id','title','description','created_at','deadline','attachments','fellow_reviewers','is_individual']

class GroupSerializer:
    assignment_id = AssignmentSerializer(read_only=True)
    student_id = MemberSerializer(read_only=True)

    class Meta:
        model = Group
        fields = ['group_id','assignment_id','student_id']

class TaskSerializer:
    assignment_id = AssignmentSerializer(read_only=True)

    class Meta:
        model = Task
        fields = ['task_id','assignment_id','title','description','deadline','attachments','score']

class SubmSerializer:
    group_id = GroupSerializer()
    task_id = TaskSerializer()

    class Meta:
        model = Submission
        fields = ['submit_id','attachment','status','submit_date','group_id','task_id','score']

class CommentSerializer:
    submit_id = SubmSerializer()
    reviewer_id = MemberSerializer()

    class Meta:
        model = Comments
        fields = ['c_id','comment','submit_id','reviewer_id','reviewed_date']






