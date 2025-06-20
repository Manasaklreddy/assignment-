from rest_framework import serializers
from .models import Quiz, Question, Option, QuizAttempt, Answer

class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['id', 'text', 'is_correct']

class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True)

    class Meta:
        model = Question
        fields = ['id', 'text', 'options']

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'created_by', 'published', 'created_at', 'questions']
        read_only_fields = ['created_by', 'created_at']

    def create(self, validated_data):
        questions_data = validated_data.pop('questions')
        quiz = Quiz.objects.create(**validated_data)
        for question_data in questions_data:
            options_data = question_data.pop('options')
            question = Question.objects.create(quiz=quiz, **question_data)
            for option_data in options_data:
                Option.objects.create(question=question, **option_data)
        return quiz

class AnswerSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['question', 'selected_option']

class QuizAttemptSubmissionSerializer(serializers.ModelSerializer):
    answers = AnswerSubmissionSerializer(many=True)

    class Meta:
        model = QuizAttempt
        fields = ['quiz', 'student', 'answers']

    def create(self, validated_data):
        answers_data = validated_data.pop('answers')
        attempt = QuizAttempt.objects.create(**validated_data)
        for answer_data in answers_data:
            Answer.objects.create(attempt=attempt, **answer_data)
        return attempt

class AnswerResultSerializer(serializers.ModelSerializer):
    question_text = serializers.CharField(source='question.text', read_only=True)
    selected_option_text = serializers.CharField(source='selected_option.text', read_only=True)
    is_correct = serializers.SerializerMethodField()

    class Meta:
        model = Answer
        fields = ['question', 'question_text', 'selected_option', 'selected_option_text', 'is_correct']

    def get_is_correct(self, obj):
        return obj.selected_option.is_correct

class AttemptAnswerSerializer(serializers.ModelSerializer):
    question = serializers.CharField(source='question.text')
    selected_option = serializers.CharField(source='selected_option.text')
    is_correct = serializers.BooleanField(source='selected_option.is_correct')
    correct_option = serializers.SerializerMethodField()

    class Meta:
        model = Answer
        fields = ['question', 'selected_option', 'is_correct', 'correct_option']

    def get_correct_option(self, obj):
        return next((o.text for o in obj.question.options.all() if o.is_correct), None)

class QuizAttemptResultSerializer(serializers.ModelSerializer):
    student = serializers.CharField(source='student.username')
    answers = AttemptAnswerSerializer(many=True, read_only=True)
    score = serializers.SerializerMethodField()

    class Meta:
        model = QuizAttempt
        fields = ['id', 'student', 'started_at', 'completed_at', 'score', 'answers']

    def get_score(self, obj):
        return sum(1 for a in obj.answers.all() if a.selected_option.is_correct)

class QuizResultsOverviewSerializer(serializers.ModelSerializer):
    attempts = QuizAttemptResultSerializer(many=True, source='quizattempt_set', read_only=True)
    total_attempts = serializers.SerializerMethodField()
    average_score = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'attempts', 'total_attempts', 'average_score']

    def get_total_attempts(self, obj):
        return obj.quizattempt_set.count()

    def get_average_score(self, obj):
        attempts = obj.quizattempt_set.all()
        if not attempts:
            return 0
        total = sum(sum(1 for a in att.answers.all() if a.selected_option.is_correct) for att in attempts)
        return round(total / len(attempts), 2)

class QuizSubmissionSerializer(serializers.Serializer):
    answers = serializers.DictField(child=serializers.CharField())

    def validate(self, data):
        quiz = self.context['quiz']
        question_ids = {str(q.id) for q in quiz.questions.all()}
        if set(data['answers'].keys()) != question_ids:
            raise serializers.ValidationError('Answers must be provided for all questions.')
        return data

    def create(self, validated_data):
        quiz = self.context['quiz']
        # Use dummy user (id=1) for now
        user = self.context.get('user')
        if not user:
            from django.contrib.auth.models import User
            user = User.objects.first()
        attempt = QuizAttempt.objects.create(quiz=quiz, student=user)
        correct_count = 0
        results = []
        for q in quiz.questions.all():
            selected_option_id = int(validated_data['answers'][str(q.id)])
            selected_option = Option.objects.get(id=selected_option_id)
            is_correct = selected_option.is_correct
            Answer.objects.create(attempt=attempt, question=q, selected_option=selected_option)
            if is_correct:
                correct_count += 1
            results.append({
                'question': q.text,
                'selected_option': selected_option.text,
                'is_correct': is_correct,
                'correct_option': next((o.text for o in q.options.all() if o.is_correct), None)
            })
        return {
            'score': correct_count,
            'total': quiz.questions.count(),
            'results': results
        } 