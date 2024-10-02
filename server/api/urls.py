from django.urls import path
from . import views
from . import auth
from . import assignmentViews
urlpatterns =[
    path('user/register/',views.CreateUserView.as_view(),name='register'),
    path('oauth/',auth.getOAuthUser,name ='oauthRegister'),
    path('oauth/getToken/', auth.getOAuthTokens, name = 'getToken'),
    path('createChannels/',views.CreateChannelView.as_view(),name='channels'),
    path('getChannels/',views.GetChannelView.as_view(),name='getChannel'),
    path('addMembers/',views.AddMembersView.as_view(), name="addMember"),
    path('getUsers/', views.GetUserView.as_view(), name = "getUser"),
    path('getMembers/',views.GetMemberView.as_view(), name='getMembers'),
    # path('getReviewers/',assignmentViews.GetReviewers.as_view(), name='getReviewers'),
   path('createAssignments/', assignmentViews.CreateAssignmentView.as_view(), name='createAssignment')
  
]