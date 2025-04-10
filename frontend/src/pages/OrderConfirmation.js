import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography, 
  Paper,
  Box,
  Grid, 
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getOrderById, trackOrder } from '../services/orderService';

const OrderConfirmation = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get orderId from URL query parameters
        const queryParams = new URLSearchParams(location.search);
        const orderId = queryParams.get('orderId');
        
        if (!orderId) {
          setError(t('orderConfirmation.errors.noOrderId'));
          setLoading(false);
          return;
        }

        // Fetch order details
          const orderData = await getOrderById(orderId);
          setOrder(orderData);

        // Calculate estimated delivery date (3-5 business days)
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 3);
        orderData.estimatedDelivery = deliveryDate.toISOString();
          
          // Fetch tracking information
          try {
            const trackingData = await trackOrder(orderId);
          setTracking(trackingData);
          } catch (trackingError) {
            console.error('Error fetching tracking info:', trackingError);
          // Don't set error state for tracking issues
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError(t('orderConfirmation.errors.fetchFailed'));
        setLoading(false);
      }
    };
    
      fetchOrderDetails();
  }, [t, location.search]);
  
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">{t('orderConfirmation.errors.orderNotFound')}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            {t('orderConfirmation.title')}
          </Typography>
          
          <Box sx={{ my: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('orderConfirmation.orderNumber')}: {order.id}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {t('orderConfirmation.status')}: {t(`orderStatus.${order.status}`)}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {t('orderConfirmation.estimatedDelivery')}: {
                new Date(order.estimatedDelivery).toLocaleDateString()
              }
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                {t('orderConfirmation.shippingDetails')}
              </Typography>
              <Typography variant="body1">
                {order.shipping.name}
              </Typography>
              <Typography variant="body1">
                {order.shipping.address}
              </Typography>
              <Typography variant="body1">
                {order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}
              </Typography>
              <Typography variant="body1">
                {order.shipping.country}
        </Typography>
              <Typography variant="body1">
                {order.shipping.phone}
                </Typography>
          </Grid>
          
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                {t('orderConfirmation.paymentDetails')}
              </Typography>
              <Typography variant="body1">
                {t('orderConfirmation.paymentMethod')}: {order.payment.method}
              </Typography>
              <Typography variant="body1">
                {t('orderConfirmation.cardName')}: {order.payment.cardName}
              </Typography>
              <Typography variant="body1">
                {t('orderConfirmation.lastFour')}: **** **** **** {order.payment.lastFour}
                </Typography>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            {t('orderConfirmation.orderItems')}
          </Typography>
          
          {order.items.map((item) => (
            <Box key={item.id} sx={{ my: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={3}>
                  <img 
                    src={item.image} 
                    alt={item.name}
                    style={{ width: '100%', maxWidth: '100px' }}
                  />
                </Grid>
                <Grid item xs={5}>
                  <Typography variant="body1">{item.name}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body1">
                    {t('orderConfirmation.quantity')}: {item.quantity}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body1">
                    €{item.price.toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          ))}

          <Divider sx={{ my: 3 }} />

          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h6">
              {t('orderConfirmation.total')}: €{order.total.toFixed(2)}
            </Typography>
          </Box>

          {tracking && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom>
                {t('orderConfirmation.trackingInfo')}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {t('orderConfirmation.currentStatus')}: {t(`trackingStatus.${tracking.status}`)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {t('orderConfirmation.currentLocation')}: {tracking.currentLocation}
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                {tracking.updates.map((update, index) => (
                  <Box key={index} sx={{ my: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(update.timestamp).toLocaleString()}
                    </Typography>
                    <Typography variant="body1">
                      {update.status} - {update.location}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </>
          )}
        </Paper>
      </motion.div>
    </Container>
  );
};

export default OrderConfirmation; 