import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, IconButton, Checkbox, FormControlLabel, Divider } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import axios from 'axios';

const emptyOption = () => ({ text: '', is_correct: false });
const emptyQuestion = () => ({ text: '', options: [emptyOption(), emptyOption()] });

const CreateQuiz = () => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleQuestionChange = (idx, field, value) => {
    const updated = [...questions];
    updated[idx][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIdx, oIdx, field, value) => {
    const updated = [...questions];
    updated[qIdx].options[oIdx][field] = value;
    setQuestions(updated);
  };

  const addQuestion = () => setQuestions([...questions, emptyQuestion()]);
  const removeQuestion = idx => setQuestions(questions.length > 1 ? questions.filter((_, i) => i !== idx) : questions);

  const addOption = qIdx => {
    const updated = [...questions];
    if (updated[qIdx].options.length < 5) updated[qIdx].options.push(emptyOption());
    setQuestions(updated);
  };
  const removeOption = (qIdx, oIdx) => {
    const updated = [...questions];
    if (updated[qIdx].options.length > 2) updated[qIdx].options.splice(oIdx, 1);
    setQuestions(updated);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      await axios.post('http://127.0.0.1:8000/quizzes/', {
        title,
        published: true,
        questions,
      });
      setSuccess(true);
      setTitle('');
      setQuestions([emptyQuestion()]);
    } catch (err) {
      setError('Failed to create quiz.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Create a New Quiz</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Quiz Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        {questions.map((q, qIdx) => (
          <Paper key={qIdx} sx={{ p: 2, mb: 2, background: '#f9f9f9' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle1">Question {qIdx + 1}</Typography>
              <IconButton onClick={() => removeQuestion(qIdx)} disabled={questions.length === 1}>
                <RemoveCircleOutlineIcon />
              </IconButton>
            </Box>
            <TextField
              label="Question Text"
              value={q.text}
              onChange={e => handleQuestionChange(qIdx, 'text', e.target.value)}
              fullWidth
              required
              sx={{ my: 1 }}
            />
            <Divider sx={{ my: 1 }} />
            {q.options.map((opt, oIdx) => (
              <Box key={oIdx} display="flex" alignItems="center" sx={{ mb: 1 }}>
                <TextField
                  label={`Option ${oIdx + 1}`}
                  value={opt.text}
                  onChange={e => handleOptionChange(qIdx, oIdx, 'text', e.target.value)}
                  required
                  sx={{ flex: 1, mr: 1 }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={opt.is_correct}
                      onChange={e => handleOptionChange(qIdx, oIdx, 'is_correct', e.target.checked)}
                    />
                  }
                  label="Correct"
                />
                <IconButton onClick={() => removeOption(qIdx, oIdx)} disabled={q.options.length === 2}>
                  <RemoveCircleOutlineIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => addOption(qIdx)}
              disabled={q.options.length >= 5}
              sx={{ mt: 1 }}
            >
              Add Option
            </Button>
          </Paper>
        ))}
        <Button startIcon={<AddCircleOutlineIcon />} onClick={addQuestion} sx={{ mb: 2 }}>
          Add Question
        </Button>
        <Box>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Quiz'}
          </Button>
        </Box>
        {success && <Typography color="success.main" sx={{ mt: 2 }}>Quiz created successfully!</Typography>}
        {error && <Typography color="error.main" sx={{ mt: 2 }}>{error}</Typography>}
      </form>
    </Paper>
  );
};

export default CreateQuiz; 