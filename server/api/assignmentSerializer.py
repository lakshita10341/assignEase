from requests import Response
from rest_framework import serializers
from .models import Assignments
from .serializers import MemberSerializer

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
            assignment.attachments=attachments
            assignment.save()
        return assignment
        
      
