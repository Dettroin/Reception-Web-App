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
    <Card className="h-[360px] flex flex-col">
      <h3 className="text-lg font-bold text-text-primary mb-6">Visitor Activity (Last 7 Days)</h3>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#475569' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#475569' }} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.1)', fontWeight: '600' }}
              itemStyle={{ color: '#2563eb' }}
            />
            <Area type="monotone" dataKey="visitors" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitors)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default DashboardCharts;
