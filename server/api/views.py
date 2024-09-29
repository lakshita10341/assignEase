from django.shortcuts import render,redirect
from django.contrib.auth import logout
from .models import User, Channels
from rest_framework import generics,status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .serializers import RegisterSerializer, ChannelSerializer

# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

class CreateChannelView():
    queryset = Channels.objects.all()
    serializer_class = ChannelSerializer
    permission_classes = [AllowAny]



    

#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         print("YO YO")
#         if serializer.is_valid():
#             self.perform_create(serializer)  # Saves the instance
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         else:
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# # def home(request):
#     return render(request, "index.html")

# def logout_view(request):
#     logout(request)
#     return redirect('/')
    