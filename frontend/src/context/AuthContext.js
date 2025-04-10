import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

// Valid user roles
const VALID_ROLES = ['admin', 'delivery', 'user'];

// Validate user data
const validateUserData = (userData) => {
  try {
    // Handle different response structures
    let user = userData.user || userData;
    
    if (!user) {
      throw new Error('Invalid user data: No user object found');
    }
    
    const { id, role, firstName, lastName, email, username } = user;
    
    if (!email && !username) {
      throw new Error('Invalid user data: Missing email or username');
    }
    
    if (!role) {
      throw new Error('Invalid user data: Missing role');
    }
    
    if (!VALID_ROLES.includes(role)) {
      throw new Error(`Invalid user role: ${role}`);
    }
    
    // Return a standardized user object
    return {
      id: id || Date.now(), // Fallback ID if none provided
      role,
      firstName: firstName || '',
      lastName: lastName || '',
      email: email || username, // Use username as fallback if no email
      username: username || email, // Use email as fallback if no username
      name: firstName && lastName ? `${firstName} ${lastName}` : username || email
    };
  } catch (error) {
    console.error('User validation error:', error);
    throw error;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const userData = await authService.getCurrentUser();
        if (userData) {
          console.log('Initializing auth with user data:', userData); // Debug log
          const validatedUser = validateUserData(userData);
          console.log('Validated user data:', validatedUser); // Debug log
          setUser(validatedUser);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        setError(error.message);
        // Clear any invalid stored data
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      console.log('Login attempt with email:', email); // Debug log
      
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      const response = await authService.login(email, password);
      console.log('Login response:', response); // Debug log
      
      if (!response || (!response.user && !response.token)) {
        throw new Error('Invalid response from server');
      }
      
      const validatedUser = validateUserData(response);
      console.log('Validated user:', validatedUser); // Debug log
      setUser(validatedUser);
      return validatedUser;
    } catch (error) {
      console.error('Login error:', error); // Debug log
      const errorMessage = error.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    try {
      authService.logout();
      setUser(null);
      setError(null);
    } catch (error) {
      console.error('Logout error:', error);
      setError('Failed to logout');
    }
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user has any of the allowed roles
  const hasAnyRole = (roles) => {
    return user?.role && roles.includes(user.role);
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    hasRole,
    hasAnyRole,
    isAuthenticated: !!user,
  };

  if (loading) {
    return null; // or a loading spinner component
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 