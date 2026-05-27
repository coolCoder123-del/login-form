import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children, addNotification }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [dbFallback, setDbFallback] = useState(false);

  const API_URL = 'http://localhost:5050/api/auth';

  // Load authenticated user credentials from session token
  const loadUser = async (currentToken) => {
    if (!currentToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/me`, {
        headers: {
          'Authorization': `Bearer ${currentToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setDbFallback(data.isFallback);
      } else {
        // Clear invalid token session
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to load user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser(token);
  }, [token]);

  // Auth Login Request
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setDbFallback(data.isFallback);
        addNotification('Welcome Back!', 'Logged in successfully.', 'success');
        return { success: true };
      } else {
        return { 
          success: false, 
          errors: data.errors || [{ msg: data.message || 'Login credentials incorrect' }]
        };
      }
    } catch (err) {
      return { 
        success: false, 
        errors: [{ msg: 'Unable to connect to backend server. Make sure it is running.' }] 
      };
    } finally {
      setLoading(false);
    }
  };

  // Auth Register Request
  const register = async (username, email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setDbFallback(data.isFallback);
        addNotification('Registration Complete', 'Your account has been registered successfully!', 'success');
        return { success: true };
      } else {
        return { 
          success: false, 
          errors: data.errors || [{ msg: data.message || 'Registration request refused' }]
        };
      }
    } catch (err) {
      return { 
        success: false, 
        errors: [{ msg: 'Unable to connect to backend server. Make sure it is running.' }] 
      };
    } finally {
      setLoading(false);
    }
  };

  // Auth Logout Clear
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    addNotification('Goodbye!', 'You have logged out successfully.', 'info');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, dbFallback, login, register, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
