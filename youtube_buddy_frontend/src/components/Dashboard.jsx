// src/components/Dashboard.js
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [language, setLanguage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const videoId = extractVideoId(url);

    if (!videoId) {
      setError(true);
      return;
    }

    setLoading(true);
    try {
      
      const response = await axios.post('http://0.0.0.0:8000/summarize', {
        video_id: videoId,
        language_code: language,
      },
      {
          headers: {
              'Content-Type': 'application/json',
          },
        }
    );

      if (response.data.summary) {
        navigate('/summary', { state: { summary: response.data.summary } });
      }
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 600,
            borderRadius: 2,
          }}
        >
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
            Youtube Summariser
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="YouTube URL"
              variant="outlined"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              sx={{ mb: 3 }}
              required
            />

            <Select
              fullWidth
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              displayEmpty
              sx={{ mb: 3 }}
              required
            >
              <MenuItem value="" disabled>
                Select Language
              </MenuItem>
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="es">Spanish</MenuItem>
              <MenuItem value="fr">French</MenuItem>
              <MenuItem value="de">German</MenuItem>
              <MenuItem value="hi">Hindi</MenuItem>
            </Select>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{
                height: 56,
                background: 'linear-gradient(45deg, #2196f3 30%, #21CBF3 90%)',
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Generate Summary'}
            </Button>
          </form>
        </Paper>

        <Snackbar
          open={error}
          autoHideDuration={6000}
          onClose={() => setError(false)}
        >
          <Alert severity="error" sx={{ width: '100%' }}>
            Failed to generate the Summary. Please try again.
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default Dashboard;