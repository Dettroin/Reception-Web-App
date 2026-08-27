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
  const baseStyle = "relative inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 outline-none overflow-hidden";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-primary-hover text-white shadow-glow hover:-translate-y-[2px] hover:shadow-[0_15px_30px_rgba(37,99,235,0.6)] border-t border-white/40 border-b border-black/20",
    secondary: "bg-white/40 backdrop-blur-md text-text-primary border border-white/60 shadow-glass hover:bg-white/60 hover:-translate-y-[2px] hover:border-primary/40",
    danger: "bg-gradient-to-r from-status-danger to-red-600 text-white shadow-[0_10px_25px_rgba(239,68,68,0.4)] hover:-translate-y-[2px] border-t border-white/30 border-b border-black/20",
    ghost: "bg-transparent text-text-secondary hover:bg-surface-secondary hover:text-text-primary hover:shadow-inner",
  };

  return (
    <button 
      type={type} 
      className={`group ${baseStyle} ${variants[variant]} ${(disabled || loading) ? 'opacity-60 cursor-not-allowed hover:translate-y-0 hover:shadow-none' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {/* Gloss reflection overlay for primary/danger buttons */}
      {(variant === 'primary' || variant === 'danger') && (
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-xl" />
      )}
      
      {loading ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin relative z-10" />
      ) : Icon ? (
        <Icon size={18} className="relative z-10 drop-shadow-sm group-hover:scale-110 transition-transform" />
      ) : null}
      <span className="relative z-10 drop-shadow-sm tracking-wide">{children}</span>
    </button>
  );
};

export default Button;
