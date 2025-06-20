import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const fetchQuizzes = () => {
    axios.get('http://127.0.0.1:8000/quizzes/')
      .then(res => setQuizzes(res.data))
      .catch(() => setQuizzes([]));
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleViewResults = (quizId) => {
    navigate(`/faculty/results/${quizId}`);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setOpen(true);
  };

  const confirmDelete = () => {
    axios.delete(`http://127.0.0.1:8000/quizzes/${deleteId}/delete/`)
      .then(() => {
        setOpen(false);
        setDeleteId(null);
        fetchQuizzes();
      });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>My Quizzes</Typography>
      <Grid container spacing={2}>
        {quizzes.map(quiz => (
          <Grid item xs={12} sm={6} key={quiz.id}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1">{quiz.title}</Typography>
                <Chip label={quiz.published ? 'Published' : 'Draft'} color={quiz.published ? 'success' : 'default'} size="small" sx={{ mr: 1 }} />
                <Typography variant="body2">Questions: {quiz.questions.length}</Typography>
                <Button variant="outlined" sx={{ mt: 1, mr: 1 }} onClick={() => handleViewResults(quiz.id)}>
                  View Results
                </Button>
                <Button variant="outlined" color="error" sx={{ mt: 1 }} onClick={() => handleDelete(quiz.id)}>
                  Delete
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Delete Quiz</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this quiz? This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyQuizzes; 