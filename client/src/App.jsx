import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';
import ThemeToggle from './components/ThemeToggle';
import Notification from './components/Notification';

function AppContent({ addNotification }) {
  const { user, loading } = useAuth();
  const [isLoginView, setIsLoginView] = useState(true);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
        <div 
          className="spinner" 
          style={{ 
            width: '2.5rem', 
            height: '2.5rem', 
            borderWidth: '3px',
            borderTopColor: 'var(--primary)' 
          }} 
        />
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
          Initializing secure session...
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Absolute theme switch element */}
      <ThemeToggle />
      
      {/* Route Views based on Auth Session State */}
      {user ? (
        <Dashboard />
      ) : isLoginView ? (
        <LoginForm 
          toggleForm={() => setIsLoginView(false)} 
          addNotification={addNotification} 
        />
      ) : (
        <RegisterForm 
          toggleForm={() => setIsLoginView(true)} 
          addNotification={addNotification} 
        />
      )}
    </>
  );
}

function App() {
  const [notifications, setNotifications] = useState([]);

  // Toast Queue Manager
  const addNotification = (title, message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { id, title, message, type }]);

    // Auto-remove notification banner after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <AuthProvider addNotification={addNotification}>
      <AppContent addNotification={addNotification} />
      <Notification 
        notifications={notifications} 
        removeNotification={removeNotification} 
      />
    </AuthProvider>
  );
}

export default App;
