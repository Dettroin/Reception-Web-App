import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../UI/Card';

const data = [
  { name: 'Mon', visitors: 12 },
  { name: 'Tue', visitors: 19 },
  { name: 'Wed', visitors: 15 },
  { name: 'Thu', visitors: 22 },
  { name: 'Fri', visitors: 28 },
  { name: 'Sat', visitors: 8 },
  { name: 'Sun', visitors: 5 },
];

const DashboardCharts = () => {
  return (
    <Card className="span-4" style={{ height: '320px', display: 'flex', flexDirection: 'column' }}>
      <h3 className="section-title" style={{ marginBottom: '24px' }}>Visitor Activity (Last 7 Days)</h3>
      <div style={{ flex: 1, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}
              itemStyle={{ color: 'var(--primary)', fontWeight: '600' }}
            />
            <Area type="monotone" dataKey="visitors" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitors)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default DashboardCharts;
