import React from 'react';

const Select = ({ label, error, required, options = [], className = '', ...props }) => {
  return (
    <div className={`flex flex-col mb-4 ${className}`}>
      {label && (
        <label className="form-label">
          {label} {required && <span className="text-status-danger ml-1">*</span>}
        </label>
      )}
      <div className="relative group">
        <select 
          className={`w-full h-12 px-4 rounded-xl bg-white/40 backdrop-blur-md border border-white/60 shadow-input text-sm font-semibold text-text-primary transition-all duration-300 outline-none cursor-pointer appearance-none bg-no-repeat bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%207l5%205%205-5%22%20fill%3D%22none%22%20stroke%3D%22%23475569%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_12px_center] pr-10
            ${error 
              ? 'border-status-danger focus:border-status-danger focus:shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
              : 'hover:bg-white/60 focus:bg-white/80 focus:border-border-focus focus:shadow-[0_0_20px_rgba(6,182,212,0.4)]'
            }
            disabled:bg-slate-200/50 disabled:text-text-muted disabled:cursor-not-allowed
          `}
          required={required}
          {...props} 
        >
          <option value="" disabled hidden>Select an option</option>
          {options.map((opt, i) => (
            <option key={i} value={opt.value} className="text-text-primary">{opt.label}</option>
          ))}
        </select>
      </div>
      {error && (
        <span className="text-status-danger text-xs mt-2 block font-bold drop-shadow-sm">
          {error}
        </span>
      )}
    </div>
  );
};

export default Select;
