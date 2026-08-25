 import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import API from '../services/api';

// Imports directly from src/assets (optimizes & bundles automatically for Vercel)
import bgImage from '../assets/bg_image.jpg';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // Clear existing authentication state when hitting the login route directly
  useEffect(() => {
    localStorage.removeItem('token');
  }, []);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const successMessage = location.state?.message;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
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

      navigate('/dashboard');
    } catch (err) {
      console.error('Login Error:', err);
      setError(err.response?.data?.message || err.message || 'Invalid email or password.');
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes badgePop {
          0% { opacity: 0; transform: scale(0.7) translateY(-8px); }
          60% { opacity: 1; transform: scale(1.05) translateY(0); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes floatOrb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -40px) scale(1.1); }
        }
        @keyframes floatOrb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-40px, 30px) scale(1.15); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes shakeX {
          10%, 90% { transform: translateX(-2px); }
          20%, 80% { transform: translateX(4px); }
          30%, 50%, 70% { transform: translateX(-8px); }
          40%, 60% { transform: translateX(8px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bgZoom {
          from { transform: scale(1.08); }
          to { transform: scale(1); }
        }

        .glass-card {
          animation: fadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .glass-card.shake {
          animation: fadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards, shakeX 0.5s ease-in-out;
        }
        .bg-image-anim {
          animation: bgZoom 8s ease-out forwards;
        }
        .logo-badge-anim {
          animation: badgePop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both;
        }
        .title-anim {
          animation: fadeInUp 0.6s ease-out 0.2s both;
        }
        .subtitle-anim {
          animation: fadeInUp 0.6s ease-out 0.3s both;
        }
        .field-anim-1 {
          animation: fadeInUp 0.6s ease-out 0.4s both;
        }
        .field-anim-2 {
          animation: fadeInUp 0.6s ease-out 0.5s both;
        }
        .field-anim-3 {
          animation: fadeInUp 0.6s ease-out 0.6s both;
        }
        .footer-anim {
          animation: fadeInUp 0.6s ease-out 0.7s both;
        }
        .orb-1 {
          animation: floatOrb1 9s ease-in-out infinite;
        }
        .orb-2 {
          animation: floatOrb2 11s ease-in-out infinite;
        }

        .glass-input {
          transition: border-color 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease, transform 0.2s ease;
        }
        .glass-input:focus {
          border-color: #0ea5e9 !important;
          box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.18), 0 0 16px rgba(14, 165, 233, 0.3) !important;
          background-color: rgba(255, 255, 255, 0.15) !important;
          transform: translateY(-1px);
        }
        .glass-input::placeholder {
          color: rgba(255, 255, 255, 0.65);
          transition: color 0.2s ease;
        }
        .glass-input:focus::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .input-label {
          transition: color 0.2s ease, transform 0.2s ease;
        }
        .input-label.active {
          color: #38bdf8;
          transform: translateX(2px);
        }

        .toggle-btn {
          transition: color 0.2s ease, transform 0.15s ease;
        }
        .toggle-btn:hover {
          color: #7dd3fc;
          transform: translateY(-50%) scale(1.08);
        }

        .submit-btn {
          position: relative;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
        }
        .submit-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            110deg,
            transparent 20%,
            rgba(255, 255, 255, 0.35) 45%,
            rgba(255, 255, 255, 0.35) 55%,
            transparent 80%
          );
          background-size: 200% 100%;
          animation: shimmer 2.8s linear infinite;
          pointer-events: none;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px -4px rgba(14, 165, 233, 0.65);
          filter: brightness(1.1);
        }
        .submit-btn:active:not(:disabled) {
          transform: translateY(0) scale(0.99);
        }

        .spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.4);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin-right: 8px;
          vertical-align: middle;
        }

        .signup-link {
          position: relative;
          transition: color 0.2s ease;
        }
        .signup-link::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 0%;
          height: 1.5px;
          background: #38bdf8;
          transition: width 0.25s ease;
        }
        .signup-link:hover::after {
          width: 100%;
        }

        .status-box {
          animation: fadeInUp 0.4s ease-out both;
        }
      `}</style>

      <div style={styles.pageBackground}>
        {/* Rendered via image import */}
        <img
          src={bgImage}
          alt="Background"
          className="bg-image-anim"
          style={styles.bgImage}
        />

        {/* Ambient Overlay for UI readability */}
        <div style={styles.darkOverlay} />

        {/* Floating ambient glow orbs */}
        <div className="orb-1" style={styles.orbOne} />
        <div className="orb-2" style={styles.orbTwo} />

        <div className={`glass-card${shake ? ' shake' : ''}`} style={styles.card}>
          <div style={styles.headerContainer}>
            <div className="logo-badge-anim" style={styles.logoBadge}>🏫 Reception Helpdesk</div>
            <h2 className="title-anim" style={styles.title}>Welcome Back</h2>
            <p className="subtitle-anim" style={styles.subtitle}>Enter your credentials to access your workspace</p>
          </div>

          {successMessage && <div className="status-box" style={styles.successBox}>{successMessage}</div>}
          {error && <div className="status-box" style={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div className="field-anim-1" style={styles.inputGroup}>
              <label
                className={`input-label${focusedField === 'email' ? ' active' : ''}`}
                style={styles.label}
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="admin@reception.com"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                className="glass-input"
                style={styles.input}
              />
            </div>

            <div className="field-anim-2" style={styles.inputGroup}>
              <label
                className={`input-label${focusedField === 'password' ? ' active' : ''}`}
                style={styles.label}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="glass-input"
                  style={{ ...styles.input, paddingRight: '72px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-btn"
                  style={styles.toggleBtn}
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            <div className="field-anim-3">
              <button
                type="submit"
                disabled={loading}
                className="submit-btn"
                style={{
                  ...styles.submitBtn,
                  opacity: loading ? 0.85 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner" />
                    Authenticating...
                  </>
                ) : (
                  'Sign In to Dashboard →'
                )}
              </button>
            </div>
          </form>

          <p className="footer-anim" style={styles.footerText}>
            Don't have an account?{' '}
            <Link to="/signup" className="signup-link" style={styles.signupLink}>
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
  orbOne: {
    position: 'absolute',
    top: '10%',
    left: '8%',
    width: '260px',
    height: '260px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(14,165,233,0.35) 0%, rgba(14,165,233,0) 70%)',
    filter: 'blur(10px)',
    zIndex: 3,
    pointerEvents: 'none',
  },
  orbTwo: {
    position: 'absolute',
    bottom: '8%',
    right: '10%',
    width: '320px',
    height: '320px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(56,189,248,0.3) 0%, rgba(56,189,248,0) 70%)',
    filter: 'blur(12px)',
    zIndex: 3,
    pointerEvents: 'none',
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