from django.urls import path
from .views import QuizListCreateView, QuizAttemptSubmitView, QuizAttemptResultView, QuizSubmitView, QuizResultsView, StudentAttemptsListView, StudentAttemptDetailView, QuizDeleteView

urlpatterns = [
    path('quizzes/', QuizListCreateView.as_view(), name='quiz-list-create'),
    path('attempts/', QuizAttemptSubmitView.as_view(), name='quiz-attempt-submit'),
    path('attempts/<int:pk>/', QuizAttemptResultView.as_view(), name='quiz-attempt-result'),
    path('quizzes/<int:quiz_id>/submit/', QuizSubmitView.as_view(), name='quiz-submit'),
    path('quizzes/<int:quiz_id>/results/', QuizResultsView.as_view(), name='quiz-results'),
    path('quizzes/<int:id>/delete/', QuizDeleteView.as_view(), name='quiz-delete'),
    path('student/attempts/', StudentAttemptsListView.as_view(), name='student-attempts-list'),
    path('student/attempts/<int:attempt_id>/', StudentAttemptDetailView.as_view(), name='student-attempt-detail'),
] 