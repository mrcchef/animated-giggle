// src/components/Dashboard.js
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ show: false, message: '' });

  // Extract video ID from YouTube URL
  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Validate YouTube URL
  const isValidYoutubeUrl = (url) => {
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return pattern.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate URL
    if (!isValidYoutubeUrl(url)) {
      setError({ 
        show: true, 
        message: 'Please enter a valid YouTube URL' 
      });
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.get(`http://localhost:8000/api/summarize`, {
        params: { url: url },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.status === 'success' && response.data.data.summary) {
        navigate('/summary', { 
          state: { 
            summary: response.data.data.summary,
            videoUrl: url 
          } 
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      let errorMessage = 'Failed to generate the summary. Please try again.';
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        // No response received
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      }

      setError({ 
        show: true, 
        message: errorMessage 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setError({ show: false, message: '' });
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
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 4,
            }}
          >
            YouTube Summarizer
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="YouTube URL"
              variant="outlined"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              error={error.show}
              helperText={error.show ? error.message : ''}
              sx={{ mb: 3 }}
              required
              placeholder="https://www.youtube.com/watch?v=..."
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading || !url.trim()}
              sx={{
                height: 56,
                background: 'linear-gradient(45deg, #2196f3 30%, #21CBF3 90%)',
                '&:disabled': {
                  background: '#ccc',
                },
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={24} color="inherit" />
                  <span>Generating Summary...</span>
                </Box>
              ) : (
                'Generate Summary'
              )}
            </Button>
          </form>
        </Paper>

        <Snackbar
          open={error.show}
          autoHideDuration={6000}
          onClose={handleCloseError}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseError} 
            severity="error" 
            sx={{ width: '100%' }}
            variant="filled"
          >
            {error.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default Dashboard;