import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  type = 'button', 
  className = '',
  loading = false,
  disabled = false,
  icon: Icon,
  ...props 
}) => {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px 16px',
    borderRadius: 'var(--radius-md)',
    fontSize: '14px',
    fontWeight: '600',
    cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
    opacity: (disabled || loading) ? 0.7 : 1,
    transition: 'all 0.2s ease',
    border: 'none',
    outline: 'none',
  };

  const variants = {
    primary: {
      background: 'var(--primary)',
      color: '#fff',
    },
    secondary: {
      background: 'var(--surface)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border)',
    },
    danger: {
      background: 'var(--danger)',
      color: '#fff',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
    }
  };

  return (
    <button 
      type={type} 
      className={`btn-${variant} ${className}`}
      style={{ ...baseStyle, ...variants[variant] }}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      ) : Icon ? (
        <Icon size={16} />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
