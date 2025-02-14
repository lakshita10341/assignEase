
from django.forms import ValidationError
from requests import Response
from rest_framework import serializers, status
from .models import User,  Channels, Member, Assignments, Task, Group, Submission, Comments

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','password','email']

        extra_kwargs = {
            'password': {'write_only':True},
            'id':{'read_only':True}

        }
               
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
    
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'bio', 'avatar'] 


class ChannelSerializer(serializers.ModelSerializer):
    #created_by = RegisterSerializer(read_only = True)
    class Meta:
        model = Channels
        fields =['channelid','channelName']
        extra_kwargs = {
            'channelid':{'read_only':True}
        }
       
    
    def create(self,validated_data):
        user = self.context['request'].user
        channel = Channels.objects.create(
            channelName = validated_data.get('channelName'),
            created_by = user,
        )
        Member.objects.create(
            channel_id = channel,
            memberName = user,
            is_admin = True,
            is_reviewer = True,
            is_moderator = True,
        )
        channel.save()
        print('done')
        return channel

class GetMemberDataSerializer(serializers.ModelSerializer):
    memberName = ProfileSerializer(read_only=True)
    class Meta:
        model = Member
        fields = ['memberName','memberid','is_moderator','is_reviewer','is_student','is_admin']

class MemberDataSerializer(serializers.ModelSerializer):
    memberName = serializers.UUIDField()
    class Meta:
        model = Member
        fields = ['memberName', 'is_moderator', 'is_reviewer','is_student']


class MemberSerializer(serializers.ModelSerializer):
    membersData = MemberDataSerializer(many=True)
    channel_id = serializers.UUIDField()

    class Meta:
        model = Member
        fields = ['membersData', 'channel_id', 'memberid']
        extra_kwargs = {
            'memberid': {"read_only": True},
        }

    def create(self, validated_data):
        channel_id = validated_data.get('channel_id')
        membersData = validated_data.get('membersData',[])
        print(f"Received channel_id: {channel_id}")
        print(f"Received membersData: {membersData}")
        members = []

        try:
   
            channel = Channels.objects.get(channelid=channel_id)

            for memberData in membersData:
                print(memberData)
                user_id = memberData.get('memberName')
                try:
                    user = User.objects.get(id=user_id)
                    member = Member.objects.create(
                        memberName=user,
                        channel_id=channel,
                        is_reviewer=memberData.get('is_reviewer'),  
                        is_moderator=memberData.get('is_moderator') , 
                        is_student=memberData.get('is_student')
                    )
                    members.append(member)
                except User.DoesNotExist:
                    raise ValidationError({'memberName': [f'User with ID {user_id} does not exist.']})
                except Exception as e:
                    raise ValidationError({'error': str(e)})
        except Channels.DoesNotExist:
             raise ValidationError({'channel_id': [f'Channel with ID {channel_id} does not exist.']})

        return members


class TaskSerializer:
    #assignment_id = AssignmentSerializer(read_only=True)

    class Meta:
        model = Task
        fields = ['task_id','assignment_id','title','description','deadline','attachments','score']

class SubmSerializer:
    # group_id = GroupSerializer()
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






