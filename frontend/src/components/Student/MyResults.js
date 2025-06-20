import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Button, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyResults = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/student/attempts/')
      .then(res => {
        setAttempts(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleView = (id) => {
    navigate(`/student/attempt/${id}`);
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>My Results</Typography>
      {attempts.length === 0 ? (
        <Typography variant="body2">You have not attempted any quizzes yet.</Typography>
      ) : (
        <List>
          {attempts.map(attempt => (
            <ListItem key={attempt.id} secondaryAction={
              <Button variant="outlined" onClick={() => handleView(attempt.id)}>View</Button>
            }>
              <ListItemText
                primary={`Quiz Attempted on ${new Date(attempt.started_at).toLocaleString()}`}
                secondary={`Score: ${attempt.score}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default MyResults; 