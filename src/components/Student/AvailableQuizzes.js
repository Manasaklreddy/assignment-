import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AvailableQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/quizzes/')
      .then(res => setQuizzes(res.data))
      .catch(() => setQuizzes([]));
  }, []);

  const handleTakeQuiz = (quizId) => {
    navigate(`/student/quiz/${quizId}`);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Available Quizzes</Typography>
      <Grid container spacing={2}>
        {quizzes.map(quiz => (
          <Grid item xs={12} sm={6} key={quiz.id}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1">{quiz.title}</Typography>
                <Typography variant="body2">Questions: {quiz.questions.length}</Typography>
                <Button variant="contained" color="primary" sx={{ mt: 1 }} onClick={() => handleTakeQuiz(quiz.id)}>
                  Take Quiz
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AvailableQuizzes; 