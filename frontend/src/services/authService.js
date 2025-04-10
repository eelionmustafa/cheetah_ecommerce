import axios from 'axios';

// Update API URL to use the correct port and path
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Mock user data for development
const mockUsers = {
  admin: {
    id: 1,
    username: 'admin_user',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    phone: '+1 234 567 8900',
  },
  user: {
    id: 2,
    username: 'demo_user',
    email: 'demo@example.com',
    firstName: 'Demo',
    lastName: 'User',
    role: 'user',
    phone: '+1 234 567 8901',
  },
  delivery: {
    id: 3,
    username: 'delivery_user',
    email: 'delivery@example.com',
    firstName: 'Delivery',
    lastName: 'User',
    role: 'delivery',
    phone: '+1 234 567 8902',
  }
};

// Configure axios defaults
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

// Helper function to check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// Helper function to create mock response
const createMockResponse = (data, message = 'Mock data (API unavailable)') => {
  console.log('Creating mock response with data:', data); // Debug log
  return {
    user: data,
    token: 'mock_token_' + Date.now(),
    message,
    isMock: true
  };
};

// Helper function to validate user data
const validateUserData = (userData) => {
  if (!userData || (!userData.email && !userData.username)) {
    throw new Error('Invalid user data: Missing email or username');
  }
  return userData;
};

const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      console.log('Registering with data:', userData); // Debug log
      
      // Validate required fields with specific error messages
      const requiredFields = ['email', 'password', 'firstName', 'lastName'];
      const missingFields = requiredFields.filter(field => !userData[field] || userData[field].trim() === '');
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }
      
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      console.log('Registration response:', response.data); // Debug log
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        const validatedUser = validateUserData(response.data.user);
        localStorage.setItem('user', JSON.stringify(validatedUser));
        return { user: validatedUser, token: response.data.token };
      }
      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Registration error:', error);
      
      if ((error.message === 'Network Error' || error.code === 'ERR_NETWORK') && isDevelopment) {
        const mockUserData = {
          ...mockUsers.user,
          ...userData,
          id: Date.now(),
          role: 'user',
        };
        const mockResponse = createMockResponse(mockUserData);
        localStorage.setItem('token', mockResponse.token);
        localStorage.setItem('user', JSON.stringify(mockUserData));
        return mockResponse;
      }
      throw new Error(error.response?.data?.message || error.message || 'Registration failed');
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      console.log('Attempting login with:', email); // Debug log
      
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      
      console.log('Login API response:', response.data); // Debug log
      
      if (response.data.token && response.data.user) {
        const validatedUser = validateUserData(response.data.user);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(validatedUser));
        return { user: validatedUser, token: response.data.token };
      }
      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Login API error:', error); // Debug log
      
      if ((error.message === 'Network Error' || error.code === 'ERR_NETWORK') && isDevelopment) {
        // Find matching mock user by email
        const mockUser = Object.values(mockUsers).find(user => user.email === email);
        if (!mockUser) {
          throw new Error('Invalid email or password');
        }
        
        console.log('Using mock user for login:', mockUser); // Debug log
        const mockResponse = createMockResponse(mockUser);
        localStorage.setItem('token', mockResponse.token);
        localStorage.setItem('user', JSON.stringify(mockUser));
        return mockResponse;
      }
      throw new Error(error.response?.data?.message || error.message || 'Invalid email or password');
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return null;
      }

      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.user) {
        const validatedUser = validateUserData(response.data.user);
        localStorage.setItem('user', JSON.stringify(validatedUser));
        return validatedUser;
      }
      return response.data;
    } catch (error) {
      if ((error.message === 'Network Error' || error.code === 'ERR_NETWORK') && isDevelopment) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            return createMockResponse(validateUserData(userData));
          } catch (e) {
            console.error('Error parsing stored user data:', e);
            return null;
          }
        }
        return null;
      }
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw new Error('Failed to get user data');
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get user role
  getUserRole: () => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        return userData.role;
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    return null;
  }
};

export default authService; 