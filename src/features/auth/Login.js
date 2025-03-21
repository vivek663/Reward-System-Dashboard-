import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, selectAuthStatus, selectAuthError, clearError } from './authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [touched, setTouched] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    // Clear any existing errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

  const validateField = (name, value) => {
    const errors = {};
    
    switch (name) {
      case 'username':
        if (!value.trim()) {
          errors.username = 'Username is required';
        }
        break;
      case 'password':
        if (!value) {
          errors.password = 'Password is required';
        } else if (value.length < 6) {
          errors.password = 'Password must be at least 6 characters';
        }
        break;
      default:
        break;
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const errors = validateField(name, value);
      setValidationErrors(prev => ({ ...prev, ...errors }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const errors = validateField(name, value);
    setValidationErrors(prev => ({ ...prev, ...errors }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const errors = {};
    Object.keys(formData).forEach(key => {
      const fieldErrors = validateField(key, formData[key]);
      Object.assign(errors, fieldErrors);
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setTouched({
        username: true,
        password: true,
      });
      return;
    }

    try {
      await dispatch(loginUser(formData)).unwrap();
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by the slice
    }
  };

  const getFieldError = (field) => {
    return touched[field] ? validationErrors[field] : '';
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to access your rewards</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldError('username') ? 'error' : ''}
              placeholder="Enter your username"
              autoComplete="username"
            />
            {getFieldError('username') && (
              <div className="error-message">{getFieldError('username')}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldError('password') ? 'error' : ''}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            {getFieldError('password') && (
              <div className="error-message">{getFieldError('password')}</div>
            )}
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="login-button"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="demo-credentials">
            <p>Demo Credentials:</p>
            <div>Admin - username: admin, password: admin123</div>
            <div>User - username: user, password: user123</div>
          </div>
        </form>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-4);
          background-color: var(--color-background);
        }

        .login-card {
          width: 100%;
          max-width: 400px;
          background-color: var(--color-white);
          border-radius: var(--border-radius);
          padding: var(--spacing-8);
          box-shadow: var(--shadow-lg);
        }

        .login-header {
          text-align: center;
          margin-bottom: var(--spacing-6);
        }

        .login-header h1 {
          font-size: 1.875rem;
          font-weight: 700;
          color: var(--color-text);
          margin-bottom: var(--spacing-2);
        }

        .login-header p {
          color: var(--color-text-light);
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-4);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-2);
        }

        label {
          font-weight: 500;
          color: var(--color-text);
        }

        input {
          padding: var(--spacing-3) var(--spacing-4);
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius);
          font-size: 1rem;
          transition: all 0.2s ease;
        }

        input:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 2px var(--color-primary-light);
        }

        input.error {
          border-color: var(--color-danger);
        }

        .error-message {
          font-size: 0.875rem;
          color: var(--color-danger);
        }

        .auth-error {
          padding: var(--spacing-3);
          background-color: var(--color-danger-light);
          color: var(--color-danger);
          border-radius: var(--border-radius);
          text-align: center;
          font-weight: 500;
        }

        .login-button {
          padding: var(--spacing-3);
          background-color: var(--color-primary);
          color: var(--color-white);
          border: none;
          border-radius: var(--border-radius);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .login-button:hover:not(:disabled) {
          background-color: #2563eb;
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .demo-credentials {
          margin-top: var(--spacing-6);
          padding: var(--spacing-4);
          background-color: var(--color-secondary-light);
          border-radius: var(--border-radius);
          font-size: 0.875rem;
        }

        .demo-credentials p {
          font-weight: 600;
          margin-bottom: var(--spacing-2);
        }

        .demo-credentials div {
          color: var(--color-text-light);
          margin-bottom: var(--spacing-1);
        }
      `}</style>
    </div>
  );
};

export default Login;
