import React, { createContext, useState, useEffect } from 'react';
import API from '../api/axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for an active session when the app loads
    const checkLoggedIn = async () => {
      try {
        // The httpOnly cookie is sent automatically by the browser
        const res = await API.get('/auth/me');
        setUser(res.data.user);
      } catch (err) {
        // No valid session, so user is null
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = (userData) => {
    // The cookie is set by the server, we just update the client state
    setUser(userData);
  };

  const logout = async () => {
    try {
      // Tell the server to clear the authentication cookie
      await API.post('/auth/logout');
    } catch (err) {
      console.error("Failed to logout from server:", err);
    } finally {
      // Clear the user state on the client
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {/* Don't render the app until the session check is complete */}
      {!loading && children}
    </AuthContext.Provider>
  );
};