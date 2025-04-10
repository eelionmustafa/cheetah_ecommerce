import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  Avatar,
  Tabs,
  Tab,
  Divider,
  Rating,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Person as PersonIcon,
  ShoppingBag as ShoppingBagIcon,
  Settings as SettingsIcon,
  RateReview as RateReviewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { getUserReviews, updateReview, deleteReview } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

const Profile = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editReview, setEditReview] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [userData, setUserData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });

  // Update user data when authenticated user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      // First set the basic user data from the auth context
      const basicUserData = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
      };
      
      // Check if there's profile data in localStorage (from login/register)
      const storedProfileData = localStorage.getItem('profileData');
      if (storedProfileData) {
        try {
          const parsedProfileData = JSON.parse(storedProfileData);
          // Merge the stored profile data with the basic user data
          setUserData({
            ...basicUserData,
            ...parsedProfileData,
            // Ensure we keep the ID from the auth context
            id: user.id,
            // Ensure we keep the email from the auth context
            email: user.email,
          });
          
          // Clear the stored profile data after using it
          localStorage.removeItem('profileData');
        } catch (error) {
          console.error('Error parsing stored profile data:', error);
          setUserData(basicUserData);
        }
      } else {
        setUserData(basicUserData);
      }
    } else {
      // Redirect to login if not authenticated
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (userData.id) {
      fetchUserReviews();
    }
  }, [userData.id]);

  const fetchUserReviews = async () => {
    try {
      setLoading(true);
      const reviews = await getUserReviews(userData.id);
      setUserReviews(reviews);
      setError(null);
    } catch (err) {
      setError('Failed to load reviews');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (review) => {
    setEditReview(review);
    setOpenDialog(true);
  };

  const handleDeleteClick = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview(reviewId);
        setUserReviews(userReviews.filter(review => review.id !== reviewId));
        setSnackbar({
          open: true,
          message: 'Review deleted successfully',
          severity: 'success'
        });
      } catch (err) {
        console.error('Error deleting review:', err);
        setSnackbar({
          open: true,
          message: 'Failed to delete review',
          severity: 'error'
        });
      }
    }
  };

  const handleUpdateReview = async () => {
    try {
      await updateReview(editReview.id, {
        rating: editReview.rating,
        comment: editReview.comment
      });
      setUserReviews(userReviews.map(review => 
        review.id === editReview.id ? editReview : review
      ));
      setOpenDialog(false);
      setEditReview(null);
      setSnackbar({
        open: true,
        message: 'Review updated successfully',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error updating review:', err);
      setSnackbar({
        open: true,
        message: 'Failed to update review',
        severity: 'error'
      });
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Here you would typically call an API to update the user profile
      // For now, we'll just simulate a successful update
      console.log('Updated profile:', userData);
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'Profile updated successfully',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error updating profile:', err);
      setSnackbar({
        open: true,
        message: 'Failed to update profile',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const TabPanel = ({ children, value, index }) => (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  // If not authenticated, don't render the profile
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Grid container spacing={4}>
          {/* Profile Header */}
          <Grid item xs={12}>
            <MotionPaper
              elevation={3}
              sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3 }}
            >
              <Avatar
                sx={{ width: 100, height: 100, bgcolor: 'primary.main' }}
              >
                {userData.firstName[0]}
                {userData.lastName[0]}
              </Avatar>
              <Box>
                <Typography variant="h4" color="primary" gutterBottom>
                  {userData.firstName} {userData.lastName}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {userData.email}
                </Typography>
              </Box>
            </MotionPaper>
          </Grid>

          {/* Profile Content */}
          <Grid item xs={12}>
            <Paper elevation={3}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab icon={<PersonIcon />} label="Personal Info" />
                <Tab icon={<ShoppingBagIcon />} label="Orders" />
                <Tab icon={<RateReviewIcon />} label="Reviews" />
                <Tab icon={<SettingsIcon />} label="Settings" />
              </Tabs>

              <TabPanel value={activeTab} index={0}>
                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        name="firstName"
                        value={userData.firstName}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        value={userData.lastName}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Phone"
                        name="phone"
                        value={userData.phone}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Address"
                        name="address"
                        value={userData.address}
                        onChange={handleInputChange}
                        multiline
                        rows={3}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </TabPanel>

              <TabPanel value={activeTab} index={1}>
                <Typography variant="h6" gutterBottom>
                  Order History
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  No orders found.
                </Typography>
              </TabPanel>

              <TabPanel value={activeTab} index={2}>
                <Typography variant="h6" gutterBottom>
                  My Reviews
                </Typography>
                {loading ? (
                  <Typography>Loading reviews...</Typography>
                ) : error ? (
                  <Typography color="error">{error}</Typography>
                ) : userReviews.length > 0 ? (
                  <Grid container spacing={2}>
                    {userReviews.map((review) => (
                      <Grid item xs={12} key={review.id}>
                        <Card>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="h6" component="div">
                                {review.productName}
                              </Typography>
                              <Box>
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditClick(review)}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteClick(review.id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Rating value={review.rating} readOnly precision={0.5} />
                              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                {new Date(review.date).toLocaleDateString()}
                              </Typography>
                            </Box>
                            <Typography variant="body1">
                              {review.comment}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    You haven't written any reviews yet.
                  </Typography>
                )}
              </TabPanel>

              <TabPanel value={activeTab} index={3}>
                <Typography variant="h6" gutterBottom>
                  Account Settings
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  Change Password
                </Button>
              </TabPanel>
            </Paper>
          </Grid>
        </Grid>
      </MotionBox>

      {/* Edit Review Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Review</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Rating
              value={editReview?.rating || 0}
              onChange={(event, newValue) => {
                setEditReview(prev => ({ ...prev, rating: newValue }));
              }}
              precision={0.5}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              margin="normal"
              label="Review Comment"
              value={editReview?.comment || ''}
              onChange={(e) => {
                setEditReview(prev => ({ ...prev, comment: e.target.value }));
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateReview} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile; 