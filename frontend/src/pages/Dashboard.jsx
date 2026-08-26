 import React, { useState, useEffect } from 'react';
import API from '../services/api';
import StatCard from '../components/Dashboard/StatCard';
import DashboardCharts from '../components/Dashboard/DashboardCharts';
import Table from '../components/UI/Table';
import Badge from '../components/UI/Badge';
import { Users, UserCheck, Calendar, MessageSquare, PhoneCall } from 'lucide-react';

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
      <div className="loading-overlay">
        <div style={{ width: '32px', height: '32px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  const visitorColumns = [
    { header: 'Name', accessor: 'name', render: (v) => <span style={{ fontWeight: 500 }}>{v.name || v.visitorName}</span> },
    { header: 'Mobile', accessor: 'mobile', render: (v) => v.mobile || v.phone || '-' },
    { header: 'Host', accessor: 'personToMeet', render: (v) => v.personToMeet || v.meetingWith || '-' },
    { header: 'Entry', accessor: 'entryTime', render: (v) => v.entryTime || v.time || 'Just now' },
    { header: 'Status', accessor: 'status', render: (v) => <Badge status={v.status || 'INSIDE'}>{v.status || 'INSIDE'}</Badge> },
  ];

  const enquiryColumns = [
    { header: 'Name', accessor: 'name', render: (e) => <span style={{ fontWeight: 500 }}>{e.name}</span> },
    { header: 'Mobile', accessor: 'mobile', render: (e) => e.mobile || '-' },
    { header: 'Type', accessor: 'enquiryType', render: (e) => e.enquiryType || e.type || 'General' },
    { header: 'Status', accessor: 'status', render: (e) => <Badge status={e.status || 'NEW'}>{e.status || 'NEW'}</Badge> },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="grid grid-cols-4 gap-4 md:grid-cols-2">
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
          title="Appointments" 
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

      <div className="grid grid-cols-1">
        <DashboardCharts />
      </div>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-1">
        <div>
          <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
            <h3 className="section-title" style={{ margin: 0 }}>Recent Visitors</h3>
          </div>
          <Table columns={visitorColumns} data={recentVisitors} emptyMessage="No visitors recorded today" />
        </div>
        
        <div>
          <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
            <h3 className="section-title" style={{ margin: 0 }}>Pending Enquiries</h3>
          </div>
          <Table columns={enquiryColumns} data={recentEnquiries} emptyMessage="No pending enquiries" />
        </div>
      </div>
    </div>
  );
}