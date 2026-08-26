import React from 'react';

const Select = ({ label, error, required, options = [], className = '', ...props }) => {
  return (
    <div className={`form-group ${className}`} style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column' }}>
      {label && (
        <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '6px' }}>
          {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
        </label>
      )}
      <select 
        className="input" 
        style={{ 
          borderColor: error ? 'var(--danger)' : 'var(--border)',
          cursor: 'pointer'
        }}
        required={required}
        {...props} 
      >
        {options.map((opt, i) => (
          <option key={i} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && (
        <span style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '4px', display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  );
};

export default Select;
