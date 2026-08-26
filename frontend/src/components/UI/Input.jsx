import React from 'react';

const Input = ({ label, error, required, icon: Icon, className = '', ...props }) => {
  return (
    <div className={`form-group ${className}`} style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column' }}>
      {label && (
        <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '6px' }}>
          {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {Icon && (
          <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
            <Icon size={16} />
          </div>
        )}
        <input 
          className="input" 
          style={{ 
            paddingLeft: Icon ? '36px' : '12px',
            borderColor: error ? 'var(--danger)' : 'var(--border)'
          }}
          required={required}
          {...props} 
        />
      </div>
      {error && (
        <span style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '4px', display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
