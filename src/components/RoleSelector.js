import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button, Paper } from '@mui/material';

const RoleSelector = () => {
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const handleContinue = () => {
    if (role === 'faculty') navigate('/faculty');
    else if (role === 'student') navigate('/student');
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Paper elevation={3} sx={{ p: 4, minWidth: 320 }}>
        <Typography variant="h4" gutterBottom align="center">Quiz App</Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="role-label">Select Role</InputLabel>
          <Select
            labelId="role-label"
            value={role}
            label="Select Role"
            onChange={e => setRole(e.target.value)}
          >
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="faculty">Faculty</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" fullWidth disabled={!role} onClick={handleContinue}>
          Continue
        </Button>
      </Paper>
    </Box>
  );
};

export default RoleSelector; 