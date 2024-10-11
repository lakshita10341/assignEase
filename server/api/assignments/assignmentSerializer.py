from xml.dom import ValidationErr
from requests import Response
from rest_framework import serializers
from ..models import Assignments, Group, Member
from ..serializers import MemberSerializer

class AddAssignmentSerializer(serializers.ModelSerializer):
    attachments = serializers.FileField(
        allow_empty_file = True,
        required =False,
    )
    class Meta:
        model = Assignments
        fields = ['channel_id','creator_id','title','description','deadline','attachments','is_individual']
        extra_kwargs={
            'assignment_id': {"read_only" : True},
        }

    def create(self, validated_data):
        attachments = validated_data.pop('attachments', None)
        creator_id = validated_data.get('creator_id')
        title = validated_data.get('title')
        description = validated_data.get('description')
        deadline = validated_data.get('deadline')  
        is_individual = validated_data.get('is_individual')
        channel_id = validated_data.get('channel_id')
        assignment = Assignments.objects.create(
            creator_id=creator_id,
            title = title,
            description = description,
            deadline = deadline,  
            is_individual = is_individual, 
            channel_id=channel_id,       
        )
        if attachments:
            assignment.attachments = attachments
            assignment.save()
        return assignment
    
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

    Group = GroupSerializer(many=True, write_only = True)
    

    class Meta:
        model = Group
        fields = ['assignment_id','Group']
        extra_kwargs = {
            'group_id' : {'read_only': True},
        }
    
    def create(self,request):
        Groups = request.data.get('Group')
        assignment_id = request.data.get('assignment_id')

        try:
            assignment = Assignments.objects.get(assignment_id=assignment_id)
        except Assignments.DoesNotExist:
            raise ValidationErr({'message': f"Assignment {assignment_id} doesn't exist"})
        created_group=[]
        for Group in Groups:
            students = []
            student_ids = Group.data.get('student_id')
            for student in student_ids:
                student_id = student_ids.data.get('id')
                try:
                    student_data = Member.objects.get(memberid = student_id)
                    if not student_data.is_student:
                        print(f"{student} is not a student")
                    else:
                        students.append(student_data)
                except Member.DoesNotExist:
                    raise serializers.ValidationError({'message': f"Student with {student} doesn't exist"})
            
            group = Group.objects.create(assignment_id=assignment)
            group.student_id.set(students)
            group.save()
            created_group.append(group)
        
        return created_group

            


                

        
    

    
    




      
