import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, CircularProgress, Chip, Button } from '@mui/material';
import axios from 'axios';

const StudentAttemptResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/student/attempts/${id}/`)
      .then(res => {
        setAttempt(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (!attempt) return <Typography color="error">Attempt not found.</Typography>;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6">Quiz Attempt Result</Typography>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Score: {attempt.score}
      </Typography>
      {attempt.answers.map((a, idx) => (
        <Box key={idx} sx={{ mb: 2 }}>
          <Typography><b>Q{idx + 1}:</b> {a.question}</Typography>
          <Typography>
            Your answer: <b>{a.selected_option}</b> {a.is_correct ? <Chip label="Correct" color="success" size="small" /> : <Chip label="Incorrect" color="error" size="small" />}<br />
            Correct answer: <b>{a.correct_option}</b>
          </Typography>
        </Box>
      ))}
      <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/student')}>Back to Dashboard</Button>
    </Paper>
  );
};

export default StudentAttemptResult; 