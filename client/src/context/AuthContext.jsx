import React, { createContext, useState, useEffect } from 'react';
import API from '../api/axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        // Set the token in the API header for the initial check
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          // Verify the token with the backend and get fresh user data
          const res = await API.get('/auth/me');
          setUser(res.data.user);
        } catch (err) {
          // Token is invalid or expired
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          delete API.defaults.headers.common['Authorization'];
          console.error("Session check failed:", err);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userData, token) => {
    // Store user data and token
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    
    // Set the user in state
    setUser(userData);

    // Set the Authorization header for all subsequent requests
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = () => {
    // Clear user data and token
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    // Clear the user from state
    setUser(null);
    
    // Remove the Authorization header
    delete API.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {/* Don't render the app until the initial session check is complete */}
      {!loading && children}
    </AuthContext.Provider>
  );
};
