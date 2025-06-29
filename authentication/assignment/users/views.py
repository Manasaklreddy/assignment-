from django.shortcuts import render
from rest_framework import generics
from .serializers import UserRegisterSerializer
from .models import User

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
# Create your views here.
