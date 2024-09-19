
from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.
class User(AbstractUser):
    user_id = models.AutoField(primary_key=True)
    email = models.EmailField(unique='True', max_length=254)
    avatar = models.ImageField(upload_to='assignments/avatars')
    bio = models.TextField(null=True, blank =True)
    

class Channels(models.Model):
    channel_id = models.AutoField(primary_key=True)
    channelName = models.CharField(unique='True')
    created_by = models.ForeignKey(User,null=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
            return self.channelName

class Member(models.Model):
     member_id = models.IntegerField(primary_key=True)
     memberName = models.ForeignKey(User, on_delete=models.CASCADE)
     channel_id = models.ForeignKey(Channels, on_delete=models.CASCADE)
     is_moderator = models.BooleanField(default=False)
     is_reviewer = models.BooleanField(default=False)
     is_student = models.BooleanField(default=True)
     
     class Meta:
          constraints = [
               models.UniqueConstraint(fields = ['memberName','channel_id'], name = 'channel_member')
          ]
     
     def __str__(self):
          return self.memberName
     
class Assignments(models.Model):
     assignment_id = models.IntegerField(primary_key=True)
     creator_id = models.ForeignKey(Member,null=True, on_delete=models.SET_NULL)
     title = models.CharField()
     description = models.TextField()
     created_at = models.DateTimeField(auto_now_add=True)
     deadline = models.DateField()
     attachments = models.FileField(upload_to='assignment_attachments/')
     is_individual = models.BooleanField(default=True)
     students_id = models.ManyToManyField(Member,related_name='assigned_students')
     reviewers_id = models.ManyToManyField(Member, related_name='assignment_reviewers')
     channel_id = models.ForeignKey(Channels,on_delete=models.CASCADE)
     def __str__(self):
          return self.title
     
class Task(models.Model):
     task_id = models.IntegerField(primary_key=True)
     assignment_id = models.ForeignKey(Assignments, on_delete=models.CASCADE)
     taskTitle = models.CharField()
     description = models.TextField()
     deadline = models.DateField()
     attachments = models.FileField(upload_to='assignment_attachments/')
     score = models.IntegerField(default=0)
     def __str__(self):
          return self.taskTitle
     
class Group(models.Model):
     group_id = models.IntegerField(primary_key=True)
     assignment_id = models.ForeignKey(Assignments,on_delete=models.CASCADE)
     student_id = models.ManyToManyField(Member,related_name='group_students')
     score = models.IntegerField(default = 0)
     def __str__(self):
          return self.assignment_id
     
class Group_submission(models.Model):
     submission_id=models.AutoField(primary_key=True)
     group_id = models.ForeignKey(Group,on_delete=models.CASCADE)
     attachment = models.FileField(upload_to ='assignment_submissions/')
     status = models.CharField(default = 'NOT STARTED')
     submit_date = models.DateTimeField(auto_now_add=True)
     task_id = models.ForeignKey(Task,on_delete=models.CASCADE)
     def __str__(self):
          return self.submission_id
     
class Comments(models.Model):
     comment_id = models.AutoField(primary_key=True)
     comment = models.TextField()
     submit_id = models.ForeignKey(Group_submission,on_delete=models.CASCADE)
     reviewer_id = models.ForeignKey(Member,null=True,on_delete=models.SET_NULL)
     reviewer_date = models.DateTimeField(auto_now_add=True)
     def __str__(self):
          return self.comment

     






