import React from 'react';

const Card = ({ children, className = '', padding = 'p-6', ...props }) => {
  return (
    <div 
      className={`glass-panel ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
