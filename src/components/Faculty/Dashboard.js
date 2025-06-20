import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import CreateQuiz from './CreateQuiz';
import MyQuizzes from './MyQuizzes';
import QuizResults from './QuizResults';
import { Routes, Route } from 'react-router-dom';

const FacultyDashboard = () => {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Faculty Dashboard</Typography>
      <Routes>
        <Route path="" element={
          <>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
              <Tab label="Create Quiz" />
              <Tab label="My Quizzes" />
            </Tabs>
            {tab === 0 && <CreateQuiz />}
            {tab === 1 && <MyQuizzes />}
          </>
        } />
        <Route path="results/:id" element={<QuizResults />} />
      </Routes>
    </Box>
  );
};

export default FacultyDashboard; 