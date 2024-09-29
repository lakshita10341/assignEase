from django.shortcuts import render,redirect
from django.contrib.auth import logout
from .models import User, Channels, Member
from rest_framework import generics,status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q

from .serializers import RegisterSerializer, ChannelSerializer, MemberSerializer

# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

class CreateChannelView(generics.CreateAPIView):
    queryset = Channels.objects.all()
    serializer_class = ChannelSerializer
    permission_classes = [IsAuthenticated]

class GetChannelView(generics.ListAPIView):
    serializer_class = ChannelSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        created_channels = Channels.objects.filter(created_by=self.request.user)
      
        return created_channels

class AddMembersView(generics.CreateAPIView):
    queryset=Member.objects.all()
    serializer_class = MemberSerializer
    permission_classes=[IsAuthenticated]
    