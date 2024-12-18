from django.urls import path
from . import views
from . import auth,googleAuth
from .assignments import assignmentViews
urlpatterns =[
    path('user/register/',views.CreateUserView.as_view(),name='register'),
    path('oauth/',auth.getOAuthUser,name ='oauthRegister'),
    path('oauth/getToken/', auth.getOAuthTokens, name = 'getToken'),
    path('createChannels/',views.CreateChannelView.as_view(),name='channels'),
    path('getChannels/',views.GetChannelView.as_view(),name='getChannel'),
    path('addMembers/',views.AddMembersView.as_view(), name="addMember"),
    path('getUsers/', views.GetUserView.as_view(), name = "getUser"),
    path('getMembers/',views.GetMemberView.as_view(), name='getMembers'),
    path('getProfile/', views.GetProfile.as_view(), name='getProfile'),
    path('createAssignments/', assignmentViews.CreateAssignmentView.as_view(), name='createAssignment'),
    path('createGroups/',assignmentViews.AddStudents.as_view(), name='addStudents'),
    path('fetchAssignments/',assignmentViews.GetAssignmennts.as_view(), name='getAssignments'),
    path('getAllotedAssignments/',assignmentViews.GetAssignmentAsStudents.as_view(),name='getAllotedAssignments'),
    path('submitAssignments/',assignmentViews.SubmitAssignment.as_view(), name='submitAssignments'),
    path('comment/',assignmentViews.Comment.as_view(),name='comment'),
    path('getSubmissions/',assignmentViews.GetSubmission.as_view(),name='getSubmission'),
    path('getComments/', assignmentViews.GetComments.as_view(),name='getComments'),
    path('getAllotedStudents/',assignmentViews.GetAssignedStudents.as_view(),name="getAllotedStudents"),
   # path('getSubmissionComments/',assignmentViews.GetSubmissionComments.as_view(),name='submissionComments')
    path('changeStatus/',assignmentViews.ChangeStatus.as_view(),name='changeStatus'),
    path('googleAuth/',googleAuth.getUser,name="getUser"),
    path('addReviewers/',assignmentViews.AddReviewers.as_view(),name="addReviewers"),

]