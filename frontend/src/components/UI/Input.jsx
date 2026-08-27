import React from 'react';

const Input = ({ label, error, required, icon: Icon, className = '', ...props }) => {
  return (
    <div className={`flex flex-col mb-4 ${className}`}>
      {label && (
        <label className="form-label">
          {label} {required && <span className="text-status-danger ml-1">*</span>}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-border-focus transition-colors z-10">
            <Icon size={18} />
          </div>
        )}
        <input 
          className={`w-full h-12 px-4 rounded-xl bg-white/40 backdrop-blur-md border border-white/60 shadow-input text-sm font-semibold text-text-primary transition-all duration-300 outline-none
            ${Icon ? 'pl-11' : ''}
            ${error 
              ? 'border-status-danger focus:border-status-danger focus:shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
              : 'hover:bg-white/60 focus:bg-white/80 focus:border-border-focus focus:shadow-[0_0_20px_rgba(6,182,212,0.4)]'
            }
            disabled:bg-slate-200/50 disabled:text-text-muted disabled:cursor-not-allowed
          `}
          required={required}
          {...props} 
        />
      </div>
      {error && (
        <span className="text-status-danger text-xs mt-2 block font-bold drop-shadow-sm">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
