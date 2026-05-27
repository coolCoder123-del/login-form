import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterForm = ({ toggleForm, addNotification }) => {
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);
  const [strength, setStrength] = useState({ score: 0, label: 'None', class: '' });

  // Dynamic Password Strength Meter
  const checkPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'None', class: '' };
    if (pass.length < 6) return { score: 1, label: 'Too short', class: 'weak' };
    
    let score = 1;
    const hasLetters = /[a-zA-Z]/.test(pass);
    const hasNumbers = /[0-9]/.test(pass);
    const hasSpecial = /[^A-Za-z0-9]/.test(pass);
    const isLong = pass.length >= 8;

    if (hasLetters && hasNumbers) score = 2;
    if (score === 2 && (hasSpecial || isLong)) score = 3;

    const labels = ['', 'Weak', 'Medium', 'Strong'];
    const classes = ['', 'weak', 'medium', 'strong'];

    return {
      score,
      label: labels[score],
      class: classes[score]
    };
  };

  // Inline Client Validations
  const validateField = (name, value) => {
    let error = '';
    if (name === 'username') {
      if (!value) {
        error = 'Username is required';
      } else if (value.length < 3) {
        error = 'Username must be at least 3 characters long';
      }
    } else if (name === 'email') {
      if (!value) {
        error = 'Email address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = 'Please enter a valid email address';
      }
    } else if (name === 'password') {
      if (!value) {
        error = 'Password is required';
      } else if (value.length < 6) {
        error = 'Password must be at least 6 characters long';
      }
    } else if (name === 'confirmPassword') {
      if (!value) {
        error = 'Confirm password is required';
      } else if (value !== formData.password) {
        error = 'Passwords do not match';
      }
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'password') {
      setStrength(checkPasswordStrength(value));
      if (formData.confirmPassword && errors.confirmPassword) {
        setErrors(prev => ({ 
          ...prev, 
          confirmPassword: value === formData.confirmPassword ? '' : 'Passwords do not match' 
        }));
      }
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all inputs
    const usernameError = validateField('username', formData.username);
    const emailError = validateField('email', formData.email);
    const passwordError = validateField('password', formData.password);
    const confirmError = validateField('confirmPassword', formData.confirmPassword);

    if (usernameError || emailError || passwordError || confirmError) {
      setErrors({
        username: usernameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmError
      });
      triggerShake();
      return;
    }

    setIsSubmitting(true);
    const result = await register(formData.username, formData.email, formData.password);
    setIsSubmitting(false);

    if (!result.success) {
      triggerShake();
      
      const backendErrors = {};
      result.errors.forEach(err => {
        if (err.path) {
          backendErrors[err.path] = err.msg;
        } else {
          addNotification('Registration Error', err.msg, 'error');
        }
      });
      setErrors(backendErrors);
    }
  };

  const triggerShake = () => {
    setShouldShake(true);
    setTimeout(() => setShouldShake(false), 400);
  };

  return (
    <div className={`glass-container ${shouldShake ? 'shake' : ''}`}>
      <h2 className="title">Sign Up</h2>
      <p className="subtitle">Create a secure profile access account</p>

      <form onSubmit={handleSubmit} noValidate>
        {/* Username Field */}
        <div className="form-group">
          <label className="form-label" htmlFor="username">Username</label>
          <div className="input-wrapper">
            <input
              type="text"
              id="username"
              name="username"
              className={`form-input ${errors.username ? 'error' : ''}`}
              placeholder="johndoe"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            <User size={16} className="input-icon" />
          </div>
          {errors.username && <div className="error-msg">{errors.username}</div>}
        </div>

        {/* Email Field */}
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email Address</label>
          <div className="input-wrapper">
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            <Mail size={16} className="input-icon" />
          </div>
          {errors.email && <div className="error-msg">{errors.email}</div>}
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <div className="input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            <Lock size={16} className="input-icon" />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex="-1"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <div className="error-msg">{errors.password}</div>}
        </div>

        {/* Password Strength Meter */}
        {formData.password && (
          <div className="strength-container">
            <div className="strength-bar-wrapper">
              <div className={`strength-bar ${strength.score >= 1 ? strength.class : ''}`} />
              <div className={`strength-bar ${strength.score >= 2 ? strength.class : ''}`} />
              <div className={`strength-bar ${strength.score >= 3 ? strength.class : ''}`} />
            </div>
            <div className="strength-text">
              <span>Password strength:</span>
              <span className={`val ${strength.class}`}>{strength.label}</span>
            </div>
          </div>
        )}

        {/* Confirm Password Field */}
        <div className="form-group">
          <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
          <div className="input-wrapper">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            <Lock size={16} className="input-icon" />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex="-1"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && <div className="error-msg">{errors.confirmPassword}</div>}
        </div>

        {/* Submit */}
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <div className="spinner" />
              <span>Creating profile...</span>
            </>
          ) : (
            <>
              <UserPlus size={18} />
              <span>Sign Up</span>
            </>
          )}
        </button>
      </form>

      {/* Switch Mode Footer */}
      <div className="auth-footer">
        Already have an account? 
        <a href="#login" className="auth-link" onClick={(e) => { e.preventDefault(); toggleForm(); }}>
          Sign In
        </a>
      </div>
    </div>
  );
};

export default RegisterForm;
