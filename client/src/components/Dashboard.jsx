import React, { useState, useEffect } from 'react';
import { LogOut, User, Mail, Calendar, Clock, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout, dbFallback } = useAuth();
  const [seconds, setSeconds] = useState(0);

  // Active Session Increment Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) return null;

  return (
    <div className="glass-container" style={{ maxWidth: '520px' }}>
      <h2 className="title" style={{ fontSize: '2rem' }}>Welcome, {user.username}!</h2>
      <p className="subtitle">You have successfully authenticated through our secure portal.</p>

      {/* Database Connection Status Badge */}
      <div className="db-status-container">
        {dbFallback ? (
          <span className="badge badge-fallback" title="Running in Local JSON storage mode">
            <Database size={12} />
            <span>Local DB Fallback Active</span>
          </span>
        ) : (
          <span className="badge badge-mongo" title="Connected directly to MongoDB">
            <Database size={12} />
            <span>MongoDB Connected</span>
          </span>
        )}
      </div>

      <div className="dashboard-grid">
        {/* Username Card */}
        <div className="info-card">
          <div className="info-icon">
            <User size={18} />
          </div>
          <div className="info-content">
            <div className="info-label">Username</div>
            <div className="info-value">{user.username}</div>
          </div>
        </div>

        {/* Email Card */}
        <div className="info-card">
          <div className="info-icon">
            <Mail size={18} />
          </div>
          <div className="info-content">
            <div className="info-label">Email Address</div>
            <div className="info-value">{user.email}</div>
          </div>
        </div>

        {/* Registration Date Card */}
        <div className="info-card">
          <div className="info-icon">
            <Calendar size={18} />
          </div>
          <div className="info-content">
            <div className="info-label">Account Created</div>
            <div className="info-value">{formatDate(user.createdAt)}</div>
          </div>
        </div>

        {/* Session Timer Card */}
        <div className="info-card">
          <div className="info-icon">
            <Clock size={18} />
          </div>
          <div className="info-content">
            <div className="info-label">Session Duration</div>
            <div className="info-value timer-value">{formatTime(seconds)}</div>
          </div>
        </div>
      </div>

      {/* Log out Action */}
      <button 
        onClick={logout} 
        className="btn btn-primary" 
        style={{ 
          backgroundColor: 'var(--danger)', 
          boxShadow: '0 4px 12px hsla(350, 80%, 60%, 0.25)' 
        }}
      >
        <LogOut size={18} />
        <span>Sign Out</span>
      </button>
    </div>
  );
};

export default Dashboard;
