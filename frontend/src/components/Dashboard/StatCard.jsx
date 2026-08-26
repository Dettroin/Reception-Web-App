import React from 'react';
import Card from '../UI/Card';

const StatCard = ({ title, value, icon: Icon, colorClass, trend }) => {
  return (
    <Card className="span-1">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px' }}>{title}</p>
          <h3 style={{ fontSize: '32px', fontWeight: '700', color: 'var(--text-primary)', margin: 0, lineHeight: 1 }}>{value}</h3>
        </div>
        {Icon && (
          <div style={{ 
            width: '40px', height: '40px', borderRadius: 'var(--radius-md)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: `var(--${colorClass}-bg)`, color: `var(--${colorClass})`
          }}>
            <Icon size={20} />
          </div>
        )}
      </div>
      {trend && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
          <span style={{ 
            color: trend.isPositive ? 'var(--success)' : 'var(--danger)', 
            fontWeight: '600' 
          }}>
            {trend.value}
          </span>
          <span style={{ color: 'var(--text-secondary)' }}>{trend.label}</span>
        </div>
      )}
    </Card>
  );
};

export default StatCard;
