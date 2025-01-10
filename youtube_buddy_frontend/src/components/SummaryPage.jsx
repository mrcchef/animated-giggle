// src/components/SummaryPage.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const SummaryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const summary = location.state?.summary || 'No summary available';

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          py: 4,
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 4, alignSelf: 'flex-start' }}
        >
          Back to Dashboard
        </Button>

        <Typography
          variant="h2"
          component="h1"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #2196f3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            mb: 4,
          }}
        >
          Summary
        </Typography>

        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            backgroundColor: '#f5f5f5',
          }}
        >
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            {summary}
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default SummaryPage;