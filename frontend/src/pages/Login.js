import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
  CircularProgress,
  Link,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('User authenticated, redirecting...', user); // Debug log
      // Redirect based on user role
      const redirectPath = location.state?.from?.pathname || 
        (user.role === 'admin' ? '/admin' : 
         user.role === 'delivery' ? '/delivery' : 
         '/profile');
      console.log('Redirecting to:', redirectPath); // Debug log
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value.trim()
    }));
    setError(''); // Clear error when user types
    setSuccessMessage(''); // Clear success message when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Attempting login with:', formData.email); // Debug log
      const userData = await login(formData.email, formData.password);
      console.log('Login successful, user data:', userData); // Debug log
      
      // Store profile data in localStorage for profile initialization
      if (userData) {
        const profileData = {
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email,
          phone: userData.phone || '',
          address: userData.address || '',
        };
        localStorage.setItem('profileData', JSON.stringify(profileData));
      }
      
      setSuccessMessage('Login successful!');
      // Navigation will be handled by the useEffect above
    } catch (err) {
      console.error('Login error in component:', err); // Debug log
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            {successMessage && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {successMessage}
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus={!formData.email}
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              error={!!error && !formData.email}
              helperText={!!error && !formData.email ? 'Email is required' : ''}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              error={!!error && !formData.password}
              helperText={!!error && !formData.password ? 'Password is required' : ''}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                Don't have an account?{' '}
                <Link component={RouterLink} to="/signup" variant="body2">
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 