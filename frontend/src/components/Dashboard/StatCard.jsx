import React from 'react';
import Card from '../UI/Card';

const StatCard = ({ title, value, icon: Icon, colorClass, trend }) => {
  // Map our semantic color classes to Tailwind colors
  const colorMap = {
    primary: { text: 'text-primary', bg: 'bg-primary-light' },
    success: { text: 'text-status-success', bg: 'bg-status-successBg' },
    info: { text: 'text-status-info', bg: 'bg-status-infoBg' },
    warning: { text: 'text-status-warning', bg: 'bg-status-warningBg' },
    danger: { text: 'text-status-danger', bg: 'bg-status-dangerBg' }
  };

  const colors = colorMap[colorClass] || colorMap.primary;

  return (
    <Card className="h-full group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-text-secondary mb-2 uppercase tracking-wider">{title}</p>
          <h3 className="text-4xl font-heading font-extrabold text-text-primary m-0 leading-none group-hover:text-primary transition-colors">{value}</h3>
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors.bg} ${colors.text} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={24} />
          </div>
        )}
      </div>
      {trend && (
        <div className="flex items-center gap-2 text-sm mt-4">
          <span className={`font-bold ${trend.isPositive ? 'text-status-success' : 'text-status-danger'}`}>
            {trend.value}
          </span>
          <span className="text-text-secondary font-medium">{trend.label}</span>
        </div>
      )}
    </Card>
  );
};

export default StatCard;
