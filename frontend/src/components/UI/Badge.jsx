import React from 'react';

const Badge = ({ children, status = 'default', className = '' }) => {
  const getStatusColor = () => {
    const s = status.toUpperCase();
    if (['INSIDE', 'CONFIRMED', 'RESOLVED', 'ACTIVE', 'SUCCESS'].includes(s)) 
      return 'bg-status-success/20 text-emerald-300 border-status-success/40 shadow-successGlow backdrop-blur-md';
    if (['PENDING', 'IN PROGRESS', 'SCHEDULED'].includes(s)) 
      return 'bg-status-warning/20 text-amber-300 border-status-warning/40 shadow-[0_0_10px_rgba(245,158,11,0.3)] backdrop-blur-md';
    if (['CHECKED OUT', 'CLOSED', 'CANCELLED', 'FAILED'].includes(s)) 
      return 'bg-white/10 text-slate-300 border-white/20 backdrop-blur-md';
    if (['NEW', 'INFO'].includes(s)) 
      return 'bg-primary/20 text-blue-300 border-primary/40 shadow-[0_0_10px_rgba(59,130,246,0.3)] backdrop-blur-md';
    
    return 'bg-white/20 text-white border-white/30 backdrop-blur-md'; // Default
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border border-solid ${getStatusColor()} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
