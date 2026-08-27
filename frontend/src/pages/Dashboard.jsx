import React, { useState, useEffect } from 'react';
import API from '../services/api';
import StatCard from '../components/Dashboard/StatCard';
import DashboardCharts from '../components/Dashboard/DashboardCharts';
import Table from '../components/UI/Table';
import Badge from '../components/UI/Badge';
import Card from '../components/UI/Card';
import { Users, UserCheck, Calendar, MessageSquare } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalVisitors: 0,
    currentlyInside: 0,
    appointmentsToday: 0,
    pendingEnquiries: 0,
    callsToday: 0,
  });
  const [recentVisitors, setRecentVisitors] = useState([]);
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [visitorsRes, apptsRes, enquiriesRes, callsRes] = await Promise.allSettled([
          API.get('/visitors'),
          API.get('/appointments'),
          API.get('/enquiries'),
          API.get('/calls'),
        ]);

        const visitors = visitorsRes.status === 'fulfilled' ? (visitorsRes.value.data?.data || visitorsRes.value.data || []) : [];
        const appts = apptsRes.status === 'fulfilled' ? (apptsRes.value.data?.data || apptsRes.value.data || []) : [];
        const enquiries = enquiriesRes.status === 'fulfilled' ? (enquiriesRes.value.data?.data || enquiriesRes.value.data || []) : [];
        const calls = callsRes.status === 'fulfilled' ? (callsRes.value.data?.data || callsRes.value.data || []) : [];

        const insideCount = visitors.filter((v) => v.status === 'INSIDE' || v.status === 'Checked In' || !v.exitTime).length;
        const pendingEnq = enquiries.filter((e) => e.status !== 'RESOLVED' && e.status !== 'Closed').length;

        setStats({
          totalVisitors: visitors.length,
          currentlyInside: insideCount,
          appointmentsToday: appts.length,
          pendingEnquiries: pendingEnq,
          callsToday: calls.length,
        });

        setRecentVisitors(visitors.slice(0, 5));
        setRecentEnquiries(enquiries.slice(0, 5));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-surface border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const visitorColumns = [
    { header: 'Name', accessor: 'name', render: (v) => <span className="font-semibold text-text-primary">{v.name || v.visitorName}</span> },
    { header: 'Mobile', accessor: 'mobile', render: (v) => v.mobile || v.phone || '-' },
    { header: 'Host', accessor: 'personToMeet', render: (v) => v.personToMeet || v.meetingWith || '-' },
    { header: 'Entry', accessor: 'entryTime', render: (v) => v.entryTime || v.time || 'Just now' },
    { header: 'Status', accessor: 'status', render: (v) => <Badge status={v.status || 'INSIDE'}>{v.status || 'INSIDE'}</Badge> },
  ];

  const enquiryColumns = [
    { header: 'Name', accessor: 'name', render: (e) => <span className="font-semibold text-text-primary">{e.name}</span> },
    { header: 'Mobile', accessor: 'mobile', render: (e) => e.mobile || '-' },
    { header: 'Type', accessor: 'enquiryType', render: (e) => e.enquiryType || e.type || 'General' },
    { header: 'Status', accessor: 'status', render: (e) => <Badge status={e.status || 'NEW'}>{e.status || 'NEW'}</Badge> },
  ];

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Visitors" 
          value={stats.totalVisitors} 
          icon={Users} 
          colorClass="primary" 
          trend={{ value: '+12%', label: 'from yesterday', isPositive: true }} 
        />
        <StatCard 
          title="Currently Inside" 
          value={stats.currentlyInside} 
          icon={UserCheck} 
          colorClass="success" 
        />
        <StatCard 
          title="Appointments Today" 
          value={stats.appointmentsToday} 
          icon={Calendar} 
          colorClass="info" 
        />
        <StatCard 
          title="Pending Enquiries" 
          value={stats.pendingEnquiries} 
          icon={MessageSquare} 
          colorClass="warning" 
        />
      </div>

      {/* Chart Row */}
      <div className="grid grid-cols-1">
        <DashboardCharts />
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding="p-0">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h3 className="text-lg font-bold text-text-primary">Recent Visitors</h3>
          </div>
          <Table columns={visitorColumns} data={recentVisitors} emptyMessage="No visitors recorded today" />
        </Card>
        
        <Card padding="p-0">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h3 className="text-lg font-bold text-text-primary">Recent Enquiries</h3>
          </div>
          <Table columns={enquiryColumns} data={recentEnquiries} emptyMessage="No pending enquiries" />
        </Card>
      </div>

    </div>
  );
}