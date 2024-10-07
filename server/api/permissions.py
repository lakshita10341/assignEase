from rest_framework.permissions import BasePermission
from .models import Member, Channels

class IsModeratorOrCreator(BasePermission):
    def has_permission(self, request, view):
        channel_id = request.data.get('channel_id')
        print(request)
        if not channel_id:
            return False
        try:
            channel = Channels.objects.get(channelid=channel_id)
        except Channels.DoesNotExist:
            return False
        
        if channel.created_by == request.memberName:
            return True
    
        try:
            member = Member.objects.get(memberName=request.User, channel_id=channel)
            return member.is_moderator
        except Member.DoesNotExist:
            return False
        

class IsReviewer(BasePermission):
    def has_permission(self, request, view):
        print(request.data)
        channel_id=request.data.get('channel_id')
        creator_id = request.data.get('creator_id')
        try:
            channel = Channels.objects.get(channelid=channel_id)
        except Channels.DoesNotExist:
            print("Channel doesn't exist")
            return False
        
        try:
            member = Member.objects.get(memberid=creator_id,channel_id=channel)
            return member.is_reviewer
        
        except Member.DoesNotExist:
            return False
