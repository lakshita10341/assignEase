from django.shortcuts import render,redirect
from django.contrib.auth import logout

from .models import Group, Submission, User, Channels, Member
from rest_framework import generics,status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q
from django.forms import ValidationError
from .serializers import GetMemberDataSerializer, ProfileSerializer, RegisterSerializer, ChannelSerializer, MemberSerializer
from .permissions import IsModeratorOrCreator

# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("Errors: ", serializer.errors)  # Print errors for debugging
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class GetProfile(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user  
        serializer = ProfileSerializer(user)  
        return Response(serializer.data)

class CreateChannelView(generics.CreateAPIView):
    queryset = Channels.objects.all()
    serializer_class = ChannelSerializer
    permission_classes = [IsAuthenticated]

    

class GetChannelView(generics.ListAPIView):
    serializer_class = ChannelSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        member_channels = Channels.objects.filter(member__memberName = self.request.user)
        return member_channels


class AddMembersView(generics.CreateAPIView):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    permission_classes = [IsAuthenticated, IsModeratorOrCreator]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)  

         
            serializer.save() 

            return Response(
                {"message": "Members added successfully."},
                status=status.HTTP_201_CREATED
            )
        except ValidationError as e:
         
            return Response(e.args[0], status=status.HTTP_400_BAD_REQUEST)


class GetUserView(generics.ListAPIView):
    serializer_class=RegisterSerializer
    permission_classes=[IsAuthenticated]
    def get_queryset(self):
        users = User.objects.all()        
        return users

class GetMemberView(generics.ListAPIView):
    queryset = Member.objects.all()
    permission_classes=[IsAuthenticated]
    serializer_class = GetMemberDataSerializer
    
    def get_queryset(self):
        channel_id = self.request.query_params.get('channel_id')
        members = Member.objects.filter(channel_id=channel_id)
        return members
    

        

        