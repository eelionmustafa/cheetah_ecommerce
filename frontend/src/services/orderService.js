import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT || '10000');
const ENABLE_MOCK_API = process.env.REACT_APP_ENABLE_MOCK_API === 'true';
const ENABLE_LOGGING = process.env.REACT_APP_ENABLE_LOGGING === 'true';

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

const log = (message, data) => {
  if (ENABLE_LOGGING) {
    console.log(`[OrderService] ${message}`, data || '');
  }
};

/**
 * Save order to the database
 * @param {Object} orderData - The order data to save
 * @returns {Promise} - Promise with the saved order data
 */
export const saveOrder = async (orderData) => {
  try {
    console.log('Saving order:', orderData);
    
    // Set up axios instance
    const api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    try {
      // Try to save order to database
      const response = await api.post('/orders', orderData);
      console.log('Order saved successfully:', response.data);
      return response.data;
    } catch (apiError) {
      console.warn('API not available, using mock order response:', apiError);
      
      // Generate a mock order ID
      const mockOrderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Return mock order data
      return {
        id: mockOrderId,
        ...orderData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
      };
    }
  } catch (error) {
    console.error('Error saving order:', error);
    
    // Generate a mock order ID as fallback
      const mockOrderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Return mock order data as fallback
      return {
        id: mockOrderId,
        ...orderData,
      status: 'pending',
        createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
      };
  }
};

/**
 * Get order by ID
 * @param {string} orderId - The order ID
 * @returns {Promise} - Promise with the order data
 */
export const getOrderById = async (orderId) => {
  try {
    console.log('Fetching order:', orderId);
    
    // Set up axios instance
    const api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    // Fetch order from database
    const response = await api.get(`/orders/${orderId}`);
    console.log('Order fetched successfully:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

/**
 * Get all orders for the current user
 * @returns {Promise} - Promise with the user's orders
 */
export const getUserOrders = async () => {
  try {
    const token = localStorage.getItem('token');
    
    try {
      // Try to get from the API if available
      const response = await axios.get(`${API_URL}/orders/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (apiError) {
      console.warn('API not available, using mock user orders:', apiError);
      
      // Return mock user orders
      return [
        {
          _id: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          items: [
            {
              productId: 'mock-product-1',
              quantity: 1,
              price: 29.99,
              name: 'Mock Product 1',
              image: 'https://via.placeholder.com/150'
            }
          ],
          total: 29.99,
          shippingInfo: {
            firstName: 'John',
            lastName: 'Doe',
            address: '123 Main St',
            city: 'Tirana',
            state: '',
            zipCode: '1000',
            country: 'Albania',
            phone: '+355 69 123 4567'
          },
          paymentInfo: {
            method: 'credit',
            cardName: 'John Doe',
            cardLastFour: '1234'
          },
          status: 'delivered',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: `ORD-${Date.now() - 1000}-${Math.floor(Math.random() * 1000)}`,
          items: [
            {
              productId: 'mock-product-2',
              quantity: 2,
              price: 19.99,
              name: 'Mock Product 2',
              image: 'https://via.placeholder.com/150'
            }
          ],
          total: 39.98,
          shippingInfo: {
            firstName: 'John',
            lastName: 'Doe',
            address: '123 Main St',
            city: 'Tirana',
            state: '',
            zipCode: '1000',
            country: 'Albania',
            phone: '+355 69 123 4567'
          },
          paymentInfo: {
            method: 'credit',
            cardName: 'John Doe',
            cardLastFour: '1234'
          },
          status: 'processing',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
    }
  } catch (error) {
    console.error('Error getting user orders:', error);
    
    // Return mock user orders as fallback
    return [
      {
        _id: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        items: [
          {
            productId: 'mock-product-1',
            quantity: 1,
            price: 29.99,
            name: 'Mock Product 1',
            image: 'https://via.placeholder.com/150'
          }
        ],
        total: 29.99,
        shippingInfo: {
          firstName: 'John',
          lastName: 'Doe',
          address: '123 Main St',
          city: 'Tirana',
          state: '',
          zipCode: '1000',
          country: 'Albania',
          phone: '+355 69 123 4567'
        },
        paymentInfo: {
          method: 'credit',
          cardName: 'John Doe',
          cardLastFour: '1234'
        },
        status: 'delivered',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: `ORD-${Date.now() - 1000}-${Math.floor(Math.random() * 1000)}`,
        items: [
          {
            productId: 'mock-product-2',
            quantity: 2,
            price: 19.99,
            name: 'Mock Product 2',
            image: 'https://via.placeholder.com/150'
          }
        ],
        total: 39.98,
        shippingInfo: {
          firstName: 'John',
          lastName: 'Doe',
          address: '123 Main St',
          city: 'Tirana',
          state: '',
          zipCode: '1000',
          country: 'Albania',
          phone: '+355 69 123 4567'
        },
        paymentInfo: {
          method: 'credit',
          cardName: 'John Doe',
          cardLastFour: '1234'
        },
        status: 'processing',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  }
};

/**
 * Track order status
 * @param {string} orderId - The order ID
 * @returns {Promise} - Promise with the order tracking data
 */
export const trackOrder = async (orderId) => {
  try {
    console.log('Tracking order:', orderId);
    
    // Set up axios instance
    const api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    // Fetch tracking info from database
    const response = await api.get(`/orders/${orderId}/tracking`);
    console.log('Tracking info fetched successfully:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error tracking order:', error);
    throw error;
  }
}; 