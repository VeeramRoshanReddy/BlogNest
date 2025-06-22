import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Fix: Use consistent token key - your LoginPage uses 'access_token'
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        // Check if token is expired
        if (decodedUser.exp * 1000 < Date.now()) {
          console.log('Token expired');
          logout();
        } else {
          setUser(decodedUser);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      // Fix: Send as form data (URLSearchParams) as your backend expects
      const response = await api.post('/login', new URLSearchParams({
        username: email,
        password: password
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const { access_token } = response.data;
      
      if (!access_token) {
        throw new Error('No access token received from server');
      }

      // Fix: Use consistent token key
      localStorage.setItem('access_token', access_token);
      setToken(access_token);
      
      const decodedUser = jwtDecode(access_token);
      setUser(decodedUser);
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      return response.data; // Return the data for the LoginPage
    } catch (error) {
      console.error('Login failed:', error);
      
      // Clean up on login failure
      localStorage.removeItem('access_token');
      setToken(null);
      setUser(null);
      delete api.defaults.headers.common['Authorization'];
      
      throw error;
    }
  };

  const signup = async (username, email, password) => {
    try {
      // First, create the user
      await api.post('/users/', { 
        username, 
        email, 
        password 
      });
      
      // If signup is successful, automatically log the user in
      // This provides a seamless experience
      return await login(email, password);

    } catch (error) {
      console.error('Signup failed:', error);
      // Re-throw the error so the component can catch it and display a message
      throw error;
    }
  };

  const logout = () => {
    // Fix: Use consistent token key
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  const value = {
    token,
    user,
    login,
    signup,
    logout,
    loading,
    isAuthenticated: !!token && !!user
  };

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