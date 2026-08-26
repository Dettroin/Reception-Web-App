import React from 'react';

const Badge = ({ children, status = 'default', className = '', ...props }) => {
  const getStatusColor = () => {
    switch (status.toUpperCase()) {
      case 'INSIDE':
      case 'CONFIRMED':
      case 'RESOLVED':
        return { bg: 'var(--success-bg)', color: 'var(--success)' };
      case 'PENDING':
      case 'SCHEDULED':
      case 'IN PROGRESS':
        return { bg: 'var(--warning-bg)', color: 'var(--warning)' };
      case 'CHECKED OUT':
      case 'COMPLETED':
        return { bg: '#f1f5f9', color: 'var(--text-secondary)' };
      case 'CANCELLED':
        return { bg: 'var(--danger-bg)', color: 'var(--danger)' };
      default:
        return { bg: 'var(--info-bg)', color: 'var(--info)' };
    }
  };

  const style = getStatusColor();

  return (
    <span 
      className={`badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 10px',
        borderRadius: '9999px', /* Pill shape */
        fontSize: '12px',
        fontWeight: '600',
        backgroundColor: style.bg,
        color: style.color,
        letterSpacing: '0.02em',
      }}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
