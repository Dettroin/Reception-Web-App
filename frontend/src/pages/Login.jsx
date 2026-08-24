 import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import API from '../services/api';

// Imports directly from src/assets (optimizes & bundles automatically for Vercel)
import bgImage from '../assets/bg_image.jpg';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const successMessage = location.state?.message;
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await API.post('/auth/login', formData);

      const rawToken =
        res.data?.token ||
        res.data?.accessToken ||
        res.data?.data?.token ||
        res.data?.data?.accessToken;

      if (!rawToken || typeof rawToken !== 'string') {
        throw new Error('Received an invalid or missing token string from the server.');
      }

      localStorage.clear();
      localStorage.setItem('token', rawToken);

      navigate('/visitors');
    } catch (err) {
      console.error('Login Error:', err);
      setError(err.response?.data?.message || err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .glass-card {
          animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .glass-input {
          transition: all 0.2s ease;
        }
        .glass-input:focus {
          border-color: #0ea5e9 !important;
          box-shadow: 0 0 12px rgba(14, 165, 233, 0.3) !important;
          background-color: rgba(255, 255, 255, 0.15) !important;
        }
        .glass-input::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }
        .submit-btn {
          transition: all 0.2s ease;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px -4px rgba(14, 165, 233, 0.6);
          filter: brightness(1.1);
        }
        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }
      `}</style>

      <div style={styles.pageBackground}>
        {/* Rendered via image import */}
        <img
          src={bgImage}
          alt="Background"
          style={styles.bgImage}
        />

        {/* Ambient Overlay for UI readability */}
        <div style={styles.darkOverlay} />

        <div className="glass-card" style={styles.card}>
          <div style={styles.headerContainer}>
            <div style={styles.logoBadge}>🏫 Reception Helpdesk</div>
            <h2 style={styles.title}>Welcome Back</h2>
            <p style={styles.subtitle}>Enter your credentials to access your workspace</p>
          </div>

          {successMessage && <div style={styles.successBox}>{successMessage}</div>}
          {error && <div style={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                name="email"
                required
                placeholder="admin@reception.com"
                value={formData.email}
                onChange={handleChange}
                className="glass-input"
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="glass-input"
                  style={{ ...styles.input, paddingRight: '72px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.toggleBtn}
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="submit-btn"
              style={{
                ...styles.submitBtn,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Authenticating...' : 'Sign In to Dashboard →'}
            </button>
          </form>

          <p style={styles.footerText}>
            Don't have an account?{' '}
            <Link to="/signup" style={styles.signupLink}>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

const styles = {
  pageBackground: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1816',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
  },
  bgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 1,
  },
  darkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    zIndex: 2,
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: '24px',
    padding: '40px 36px',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.35)',
    position: 'relative',
    zIndex: 10,
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '28px',
  },
  logoBadge: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#ffffff',
    backgroundColor: 'rgba(14, 165, 233, 0.45)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    padding: '6px 14px',
    borderRadius: '9999px',
    marginBottom: '16px',
    letterSpacing: '0.5px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
  title: {
    fontSize: '28px',
    fontWeight: 800,
    color: '#ffffff',
    margin: '0 0 8px 0',
    textAlign: 'center',
    letterSpacing: '-0.5px',
    textShadow: '0 2px 10px rgba(0,0,0,0.6)',
  },
  subtitle: {
    fontSize: '14px',
    color: '#f1f5f9',
    fontWeight: 500,
    margin: 0,
    textAlign: 'center',
    lineHeight: '1.4',
    textShadow: '0 1px 6px rgba(0,0,0,0.6)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '11px',
    fontWeight: 800,
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    textShadow: '0 1px 4px rgba(0,0,0,0.7)',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.3)',
  },
  toggleBtn: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'transparent',
    border: 'none',
    color: '#38bdf8',
    fontSize: '11px',
    fontWeight: 800,
    cursor: 'pointer',
    letterSpacing: '0.5px',
    textShadow: '0 1px 4px rgba(0,0,0,0.7)',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: 700,
    marginTop: '6px',
    letterSpacing: '0.2px',
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)',
  },
  errorBox: {
    padding: '12px 16px',
    backgroundColor: 'rgba(220, 38, 38, 0.4)',
    border: '1px solid rgba(248, 113, 113, 0.7)',
    color: '#fecaca',
    borderRadius: '12px',
    fontSize: '13px',
    marginBottom: '20px',
    backdropFilter: 'blur(4px)',
  },
  successBox: {
    padding: '12px 16px',
    backgroundColor: 'rgba(22, 163, 74, 0.4)',
    border: '1px solid rgba(74, 222, 128, 0.7)',
    color: '#bbf7d0',
    borderRadius: '12px',
    fontSize: '13px',
    marginBottom: '20px',
    textAlign: 'center',
    backdropFilter: 'blur(4px)',
  },
  footerText: {
    marginTop: '28px',
    textAlign: 'center',
    fontSize: '13.5px',
    color: '#ffffff',
    fontWeight: 500,
    textShadow: '0 1px 4px rgba(0,0,0,0.7)',
  },
  signupLink: {
    color: '#38bdf8',
    fontWeight: 700,
    textDecoration: 'none',
  },
};