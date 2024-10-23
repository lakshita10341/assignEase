from xml.dom import ValidationErr
from requests import Response
from rest_framework import serializers
from ..models import Assignments, Group, Member
from ..serializers import MemberSerializer, ProfileSerializer

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
        creator_id = Member.objects.get(memberName = user_id)
        assignment = Assignments.objects.create(
            creator_id=creator_id,
            title = title,
            description = description,
            deadline = deadline,  
           
            channel_id=channel_id,       
        )
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
        print(assignment_id,"k")
        print(assignment_id.assignment_id)
        try:
            assignment = Assignments.objects.get(assignment_id=assignment_id.assignment_id)
            print(assignment.assignment_id,"p")
        except Assignments.DoesNotExist:
            raise ValidationErr({'message': f"Assignment {assignment_id} doesn't exist"})
        created_group=[]
        for GroupData in Groups:
            students = []
            student_ids = GroupData.get('student_id')
            print(student_ids)
            for student in student_ids:
                
                try:
                    student_data = Member.objects.get(memberid = student)
                    if not student_data.is_student:
                        print(f"{student} is not a student")
                    else:
                        students.append(student_data)
                except Member.DoesNotExist:
                    raise serializers.ValidationError({'message': f"Student with {student} doesn't exist"})
            print("y")
            group = Group.objects.create(assignment_id=assignment)
            group.student_id.set(students)
            group.save()
            created_group.append(group)
            print("u")
        return created_group

class StudentSerializer(serializers.ModelSerializer):
    memberName = ProfileSerializer(read_only=True)
    class Meta:
        model = Member
        fields = ['memberid','memberName']           


                

        
    

    
    




      
