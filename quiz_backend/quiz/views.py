from django.shortcuts import render
from rest_framework import generics
from .models import Quiz, QuizAttempt
from .serializers import QuizSerializer, QuizAttemptSubmissionSerializer, QuizAttemptResultSerializer, QuizSubmissionSerializer, QuizResultsOverviewSerializer
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# Create your views here.

class QuizListCreateView(generics.ListCreateAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer

    def perform_create(self, serializer):
        user = User.objects.first()  # Use the first user for now
        serializer.save(created_by=user)

class QuizAttemptSubmitView(generics.CreateAPIView):
    queryset = QuizAttempt.objects.all()
    serializer_class = QuizAttemptSubmissionSerializer

class QuizAttemptResultView(generics.RetrieveAPIView):
    queryset = QuizAttempt.objects.all()
    serializer_class = QuizAttemptResultSerializer

class QuizSubmitView(APIView):
    def post(self, request, quiz_id):
        from .models import Quiz
        try:
            quiz = Quiz.objects.get(id=quiz_id)
        except Quiz.DoesNotExist:
            return Response({'detail': 'Quiz not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = QuizSubmissionSerializer(data=request.data, context={'quiz': quiz, 'user': None})
        if serializer.is_valid():
            result = serializer.save()
            return Response(result, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class QuizResultsView(APIView):
    def get(self, request, quiz_id):
        from .models import Quiz
        try:
            quiz = Quiz.objects.get(id=quiz_id)
        except Quiz.DoesNotExist:
            return Response({'detail': 'Quiz not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = QuizResultsOverviewSerializer(quiz)
        return Response(serializer.data)

class StudentAttemptsListView(APIView):
    def get(self, request):
        from .models import QuizAttempt
        from django.contrib.auth.models import User
        user = User.objects.first()  # Dummy user
        attempts = QuizAttempt.objects.filter(student=user).order_by('-started_at')
        from .serializers import QuizAttemptResultSerializer
        serializer = QuizAttemptResultSerializer(attempts, many=True)
        return Response(serializer.data)

class StudentAttemptDetailView(APIView):
    def get(self, request, attempt_id):
        from .models import QuizAttempt
        try:
            attempt = QuizAttempt.objects.get(id=attempt_id)
        except QuizAttempt.DoesNotExist:
            return Response({'detail': 'Attempt not found.'}, status=status.HTTP_404_NOT_FOUND)
        from .serializers import QuizAttemptResultSerializer
        serializer = QuizAttemptResultSerializer(attempt)
        return Response(serializer.data)

class QuizDeleteView(generics.DestroyAPIView):
    queryset = Quiz.objects.all()
    lookup_field = 'id'
