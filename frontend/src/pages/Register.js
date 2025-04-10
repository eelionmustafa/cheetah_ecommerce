import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  Link,
  Alert,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import authService from '../services/authService';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isApiAvailable, setIsApiAvailable] = useState(true);

  const validateForm = () => {
    const requiredFields = ['email', 'password', 'firstName', 'lastName'];
    const missingFields = requiredFields.filter(field => !formData[field] || formData[field].trim() === '');
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.trim()
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Log the full form data before processing
      console.log('Full form data:', formData);

      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registrationData } = formData;
      
      // Add default values for profile fields if not provided
      const completeRegistrationData = {
        ...registrationData,
        address: registrationData.address || '',
        role: 'user', // Default role for new registrations
        // Ensure all required fields are explicitly set
        email: registrationData.email.trim(),
        password: registrationData.password,
        firstName: registrationData.firstName.trim(),
        lastName: registrationData.lastName.trim(),
        phone: registrationData.phone.trim()
      };
      
      console.log('Attempting registration with:', completeRegistrationData); // Debug log
      
      // Store the registration data in localStorage for profile initialization
      const profileData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || '',
        address: '',
      };
      localStorage.setItem('profileData', JSON.stringify(profileData));
      
      // Create a mock user for development
      const mockUser = {
        id: Date.now(),
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: 'user',
        phone: formData.phone || '',
      };
      
      // Store mock user data
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', 'mock_token_' + Date.now());
      
      // Navigate to profile page
      navigate('/profile');
      
    } catch (err) {
      console.error('Registration error:', err);
      // Still proceed to profile page even if there's an error
      navigate('/profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ mt: 8, mb: 4 }}
      >
        <MotionPaper
          elevation={3}
          sx={{ p: 4 }}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <Typography variant="h4" component="h1" gutterBottom align="center">
            {t('auth.register.title')}
          </Typography>
          
          {!isApiAvailable && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Running in development mode with mock data (API unavailable)
            </Alert>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label={t('auth.register.firstName')}
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={loading}
                  error={!formData.firstName && error}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label={t('auth.register.lastName')}
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={loading}
                  error={!formData.lastName && error}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label={t('auth.register.email')}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                  error={!formData.email && error}
                  helperText={!formData.email && error ? 'Email is required' : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label={t('auth.register.phone')}
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label={t('auth.register.password')}
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading}
                  error={!formData.password && error}
                  helperText={!formData.password && error ? 'Password is required' : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label={t('auth.register.confirmPassword')}
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={loading}
                  error={formData.password !== formData.confirmPassword && error}
                  helperText={formData.password !== formData.confirmPassword && error ? 'Passwords do not match' : ''}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : t('auth.register.submit')}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                {t('auth.register.haveAccount')}{' '}
                <Link component={RouterLink} to="/login" variant="body2">
                  {t('auth.register.signIn')}
                </Link>
              </Typography>
            </Box>
          </form>
        </MotionPaper>
      </MotionBox>
    </Container>
  );
};

export default Register; 