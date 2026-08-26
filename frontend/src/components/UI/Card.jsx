import React from 'react';

const Card = ({ children, className = '', style = {}, ...props }) => {
  return (
    <div 
      className={`card ${className}`} 
      style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--border)',
        padding: '24px',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
