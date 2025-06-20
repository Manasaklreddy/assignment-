from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

class User(AbstractUser):
    ROLE_CHOICES = (
        ('faculty', 'Faculty'),
        ('student', 'Student'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
