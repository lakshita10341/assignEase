from django.urls import path
from . import views
from . import auth
urlpatterns =[
    path('user/register/',views.CreateUserView.as_view(),name='register'),
    path('oauth/',auth.getOAuthUser,name ='oauthRegister'),
    path('oauth/getToken/', auth.getOAuthTokens, name = 'getToken'),
    path('createChannels/',views.CreateChannelView.as_view(),name='channels'),
    path('getChannels/',views.GetChannelView.as_view(),name='getChannel'),
    path('addMembers/',views.AddMembersView.as_view(), name="addMember")

  
]