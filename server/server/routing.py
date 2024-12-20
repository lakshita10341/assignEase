from django.urls import re_path
from . import consumers
from . import comments

websocket_urlpatterns = [
    re_path(r'ws/submissions/(?P<group_id>\w+)/$', consumers.SubmissionConsumer.as_asgi()),
    re_path(r'ws/comments/(?P<subm_id>\w+)/$', comments.CommentConsumer.as_asgi()),
]