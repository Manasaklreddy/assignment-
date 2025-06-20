import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RoleSelector from './components/RoleSelector';
import FacultyDashboard from './components/Faculty/Dashboard';
import StudentDashboard from './components/Student/Dashboard';
import { CssBaseline, Container } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#607d8b' },
    accent: { main: '#00bfae', purple: '#7c4dff', orange: '#ff9800' },
    background: { default: '#f4f6fa', paper: '#ffffff' },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow: '0 4px 16px rgba(33, 150, 243, 0.10)',
          transition: 'box-shadow 0.3s',
          '&:hover': { boxShadow: '0 8px 32px rgba(33, 150, 243, 0.18)' },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          fontWeight: 600,
          transition: 'background 0.2s, color 0.2s',
          '&:hover': {
            background: 'linear-gradient(90deg, #1976d2 60%, #00bfae 100%)',
            color: '#fff',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { fontWeight: 600, fontSize: 16 },
      },
    },
  },
  typography: {
    fontFamily: 'Segoe UI, Roboto, Arial, sans-serif',
    h5: { fontWeight: 700, color: '#1976d2' },
    h6: { fontWeight: 600, color: '#607d8b' },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Container maxWidth="md" sx={{ mt: 2, mb: 4 }}>
          <Routes>
            <Route path="/" element={<RoleSelector />} />
            <Route path="/faculty/*" element={<FacultyDashboard />} />
            <Route path="/student/*" element={<StudentDashboard />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
