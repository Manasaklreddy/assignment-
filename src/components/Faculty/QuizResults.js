import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, CircularProgress, Chip } from '@mui/material';
import axios from 'axios';

const QuizResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/quizzes/${id}/results/`)
      .then(res => {
        setResults(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (!results) return <Typography color="error">No results found for this quiz.</Typography>;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Results for: {results.title}</Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Total Attempts: <b>{results.total_attempts}</b> | Average Score: <b>{results.average_score}</b>
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Answers</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.attempts.map(attempt => (
              <TableRow key={attempt.id}>
                <TableCell>{attempt.student}</TableCell>
                <TableCell>{attempt.score}</TableCell>
                <TableCell>
                  {attempt.answers.map((a, idx) => (
                    <Box key={idx} sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        <b>Q:</b> {a.question}<br />
                        <b>Ans:</b> {a.selected_option} {a.is_correct ? <Chip label="Correct" color="success" size="small" /> : <Chip label="Incorrect" color="error" size="small" />}<br />
                        <b>Correct:</b> {a.correct_option}
                      </Typography>
                    </Box>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" onClick={() => navigate('/faculty')}>
        Back to Dashboard
      </Button>
    </Paper>
  );
};

export default QuizResults; 