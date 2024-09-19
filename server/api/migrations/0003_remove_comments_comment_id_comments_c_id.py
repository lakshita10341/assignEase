# Generated by Django 5.1.1 on 2024-09-19 13:56

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_remove_assignments_students_id_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='comments',
            name='comment_id',
        ),
        migrations.AddField(
            model_name='comments',
            name='c_id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True),
        ),
    ]