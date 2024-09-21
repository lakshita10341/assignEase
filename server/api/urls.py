from django.urls import path
from . import views
urlpatterns =[
    path('user/register/',views.CreateUserView.as_view(),name='register')
]