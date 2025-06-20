import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import AvailableQuizzes from './AvailableQuizzes';
import MyResults from './MyResults';
import { Routes, Route } from 'react-router-dom';
import TakeQuiz from './TakeQuiz';
import StudentAttemptResult from './StudentAttemptResult';

const StudentDashboard = () => {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Student Dashboard</Typography>
      <Routes>
        <Route path="" element={
          <>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
              <Tab label="Available Quizzes" />
              <Tab label="My Results" />
            </Tabs>
            {tab === 0 && <AvailableQuizzes />}
            {tab === 1 && <MyResults />}
          </>
        } />
        <Route path="quiz/:id" element={<TakeQuiz />} />
        <Route path="attempt/:id" element={<StudentAttemptResult />} />
      </Routes>
    </Box>
  );
};

export default StudentDashboard; 