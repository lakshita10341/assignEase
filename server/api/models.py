
from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.
class User(AbstractUser):
    email = models.EmailField(unique='True', max_length=254)
    avatar = models.ImageField(upload_to='assignments/avatars')
    bio = models.TextField(null=True, blank =True)
    

class Channels(models.Model):
    channelName = models.CharField(unique='True')
    created_by = models.ForeignKey(User,null=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
            return self.channelName

class Member(models.Model):
     member = models.ForeignKey(User, on_delete=models.CASCADE)
     channel_id = models.ForeignKey(Channels, on_delete=models.CASCADE)
     is_moderator = models.BooleanField(default=False)
     is_reviewer = models.BooleanField(default=False)
     is_student = models.BooleanField(default=True)
     def __str__(self):
          return self.member
     
class Assignments(models.Model):
     creator_id = models.OneToOneField(Member,null=True, on_delete=models.SET_NULL)
     title = models.CharField()
     description = models.TextField()
     created_at = models.DateTimeField(auto_now_add=True)
     deadline = models.DateField()
     attachments = models.FileField(upload_to='assignment_attachments/')
     is_individual = models.BooleanField(default=True)
     students_id = models.ManyToManyField(User,related_name='assigned_students')
     reviewers_id = models.ManyToManyField(User, related_name='assignment_reviewers')
     def __str__(self):
          return self.title
     
class Task(models.Model):
     assignment_id = models.ForeignKey(Assignments, on_delete=models.CASCADE)
     task = models.CharField()
     description = models.TextField()
     deadline = models.DateField()
     attachments = models.FileField(upload_to='assignment_attachments/')
     def __str__(self):
          return self.task
     
class Group(models.Model):
     assignment_id = models.ForeignKey(Assignments,on_delete=models.CASCADE)
     student_id = models.ManyToManyField(Member,related_name='group_students')
     def __str__(self):
          return self.assignment
     
class Group_submission(models.Model):
     group_id = models.ForeignKey(Group,on_delete=models.CASCADE)
     attachment = models.FileField(upload_to ='assignment_submissions/')
     status = models.CharField(default = 'NOT STARTED')
     submit_date = models.DateTimeField(auto_now_add=True)
     task_id = models.ForeignKey(Task,on_delete=models.CASCADE)
     
class Comments(models.Model):
     comment = models.TextField()
     submit_id = models.ForeignKey(Group_submission,on_delete=models.CASCADE)
     reviewer_id = models.ForeignKey(Member,null=True,on_delete=models.SET_NULL)
     reviewer_date = models.DateTimeField(auto_now_add=True)
     def __str__(self):
          return self.comment

     






