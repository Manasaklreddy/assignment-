import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, RadioGroup, FormControlLabel, Radio, Button, CircularProgress, Chip } from '@mui/material';
import axios from 'axios';

const TakeQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/quizzes/')
      .then(res => {
        const found = res.data.find(q => String(q.id) === String(id));
        setQuiz(found);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleChange = (qId, optId) => {
    setAnswers({ ...answers, [qId]: optId });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const resp = await axios.post(`http://127.0.0.1:8000/quizzes/${id}/submit/`, {
        answers,
      });
      setResult(resp.data);
    } catch (err) {
      setError('Submission failed. Please try again.');
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (!quiz) return <Typography color="error">Quiz not found.</Typography>;

  if (result) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Quiz Results</Typography>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Score: {result.score} / {result.total}
        </Typography>
        {result.results.map((r, idx) => (
          <Box key={idx} sx={{ mb: 2 }}>
            <Typography><b>Q{idx + 1}:</b> {r.question}</Typography>
            <Typography>
              Your answer: <b>{r.selected_option}</b> {r.is_correct ? <Chip label="Correct" color="success" size="small" /> : <Chip label="Incorrect" color="error" size="small" />}<br />
              Correct answer: <b>{r.correct_option}</b>
            </Typography>
          </Box>
        ))}
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/student')}>Back to Dashboard</Button>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>{quiz.title}</Typography>
      <form onSubmit={handleSubmit}>
        {quiz.questions.map((q, idx) => (
          <Box key={q.id} sx={{ mb: 3 }}>
            <Typography variant="subtitle1">{`Q${idx + 1}: ${q.text}`}</Typography>
            <RadioGroup
              value={answers[q.id] || ''}
              onChange={e => handleChange(q.id, e.target.value)}
            >
              {q.options.map(opt => (
                <FormControlLabel
                  key={opt.id}
                  value={String(opt.id)}
                  control={<Radio required />}
                  label={opt.text}
                />
              ))}
            </RadioGroup>
          </Box>
        ))}
        <Button type="submit" variant="contained" color="primary">Submit Quiz</Button>
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      </form>
    </Paper>
  );
};

export default TakeQuiz; 