 import React, { useState, useEffect } from 'react';
import API from '../services/api';

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

  const statCards = [
    { title: 'Total Visitors (Today)', count: stats.totalVisitors, color: '#3b82f6', bgGlow: 'rgba(59, 130, 246, 0.12)' },
    { title: 'Currently Inside', count: stats.currentlyInside, color: '#10b981', bgGlow: 'rgba(16, 185, 129, 0.12)' },
    { title: "Today's Appointments", count: stats.appointmentsToday, color: '#8b5cf6', bgGlow: 'rgba(139, 92, 246, 0.12)' },
    { title: 'Pending Enquiries', count: stats.pendingEnquiries, color: '#f59e0b', bgGlow: 'rgba(245, 158, 11, 0.12)' },
    { title: "Today's Calls", count: stats.callsToday, color: '#ec4899', bgGlow: 'rgba(236, 72, 153, 0.12)' },
  ];

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '16px' }}>
        Loading dashboard metrics...
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header Banner */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Reception Overview</h1>
        <p style={styles.headerSubtitle}>Real-time analytics and visitor tracking</p>
      </div>

      {/* Metrics Card Grid */}
      <div style={styles.cardGrid}>
        {statCards.map((card, idx) => (
          <div key={idx} style={{ ...styles.card, borderTop: `4px solid ${card.color}` }}>
            <span style={styles.cardTitle}>{card.title}</span>
            <div style={styles.countWrapper}>
              <span style={{ ...styles.cardCount, color: card.color }}>{card.count}</span>
              <div style={{ ...styles.badge, backgroundColor: card.bgGlow, color: card.color }}>Live</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tables Section */}
      <div style={styles.tablesContainer}>
        {/* Today's Visitors Card */}
        <div style={styles.sectionCard}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Today's Visitors</h3>
            <span style={styles.recordBadge}>{recentVisitors.length} Entries</span>
          </div>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>NAME</th>
                  <th style={styles.th}>MOBILE</th>
                  <th style={styles.th}>PERSON TO MEET</th>
                  <th style={styles.th}>ENTRY TIME</th>
                  <th style={styles.th}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {recentVisitors.length > 0 ? (
                  recentVisitors.map((v) => (
                    <tr key={v._id || v.id} style={styles.tr}>
                      <td style={styles.tdBold}>{v.name || v.visitorName}</td>
                      <td style={styles.td}>{v.mobile || v.phone || '-'}</td>
                      <td style={styles.td}>{v.personToMeet || v.meetingWith || '-'}</td>
                      <td style={styles.td}>{v.entryTime || v.time || 'Just now'}</td>
                      <td style={styles.td}>
                        <span style={v.status === 'INSIDE' ? styles.statusActive : styles.statusInactive}>
                          {v.status || 'INSIDE'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={styles.emptyTd}>
                      No visitors recorded today
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Enquiries Card */}
        <div style={styles.sectionCard}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Pending Enquiries</h3>
            <span style={styles.recordBadge}>{recentEnquiries.length} Pending</span>
          </div>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>NAME</th>
                  <th style={styles.th}>MOBILE</th>
                  <th style={styles.th}>TYPE</th>
                  <th style={styles.th}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {recentEnquiries.length > 0 ? (
                  recentEnquiries.map((e) => (
                    <tr key={e._id || e.id} style={styles.tr}>
                      <td style={styles.tdBold}>{e.name}</td>
                      <td style={styles.td}>{e.mobile || '-'}</td>
                      <td style={styles.td}>{e.enquiryType || e.type || 'General'}</td>
                      <td style={styles.td}>
                        <span style={styles.statusPending}>{e.status || 'NEW'}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={styles.emptyTd}>
                      No pending enquiries
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Visual Stylesheet Object
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '4px',
  },
  headerTitle: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 4px 0',
  },
  headerSubtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    justify: 'space-between',
    border: '1px solid #e2e8f0',
  },
  cardTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b',
    marginBottom: '12px',
  },
  countWrapper: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  cardCount: {
    fontSize: '32px',
    fontWeight: '800',
  },
  badge: {
    fontSize: '11px',
    fontWeight: '700',
    padding: '3px 8px',
    borderRadius: '12px',
    textTransform: 'uppercase',
  },
  tablesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0,
  },
  recordBadge: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    padding: '4px 10px',
    borderRadius: '6px',
  },
  tableWrap: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  th: {
    padding: '12px 16px',
    fontSize: '11px',
    fontWeight: '700',
    color: '#64748b',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
    letterSpacing: '0.5px',
  },
  tr: {
    borderBottom: '1px solid #f1f5f9',
  },
  td: {
    padding: '14px 16px',
    fontSize: '14px',
    color: '#334155',
  },
  tdBold: {
    padding: '14px 16px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#0f172a',
  },
  emptyTd: {
    padding: '24px 16px',
    fontSize: '14px',
    color: '#94a3b8',
    textAlign: 'center',
  },
  statusActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    color: '#059669',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '700',
  },
  statusInactive: {
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '700',
  },
  statusPending: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    color: '#d97706',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '700',
  },
};