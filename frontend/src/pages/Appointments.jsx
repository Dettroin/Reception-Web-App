 import React, { useState, useEffect } from 'react';
import API from '../services/api';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State updated to match backend Mongoose schema exactly
  const [formData, setFormData] = useState({ 
    visitorName: '', 
    mobile: '',
    meetingWith: '', 
    department: '',
    date: '', 
    time: '',
    purpose: ''
  });

  const fetchAppointments = async () => {
    try {
      const res = await API.get('/appointments');
      setAppointments(res.data?.data || res.data || []);
    } catch (err) {
      console.error('Error loading appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchAppointments(); 
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post('/appointments', formData);
      
      // Reset form state after success
      setFormData({ 
        visitorName: '', 
        mobile: '', 
        meetingWith: '', 
        department: '', 
        date: '', 
        time: '', 
        purpose: '' 
      });
      fetchAppointments();
    } catch (err) {
      console.error('API Error Details:', err.response?.data || err);
      alert(err.response?.data?.message || 'Failed to schedule appointment.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Appointments</h1>
        <p style={styles.headerSubtitle}>Schedule and oversee upcoming visitor meetings</p>
      </div>

      <div style={styles.sectionCard}>
        <h3 style={styles.sectionTitle}>Schedule New Appointment</h3>
        <form onSubmit={handleSubmit} style={styles.formGrid}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Visitor Name *</label>
            <input 
              type="text" 
              required 
              placeholder="Alice Johnson" 
              value={formData.visitorName} 
              onChange={(e) => setFormData({ ...formData, visitorName: e.target.value })} 
              style={styles.input} 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Mobile Number *</label>
            <input 
              type="tel" 
              required 
              placeholder="9876543210" 
              value={formData.mobile} 
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} 
              style={styles.input} 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Meeting With (Host) *</label>
            <input 
              type="text" 
              required 
              placeholder="Manager Name" 
              value={formData.meetingWith} 
              onChange={(e) => setFormData({ ...formData, meetingWith: e.target.value })} 
              style={styles.input} 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Department</label>
            <input 
              type="text" 
              placeholder="HR / IT / Admin" 
              value={formData.department} 
              onChange={(e) => setFormData({ ...formData, department: e.target.value })} 
              style={styles.input} 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Date *</label>
            <input 
              type="date" 
              required 
              value={formData.date} 
              onChange={(e) => setFormData({ ...formData, date: e.target.value })} 
              style={styles.input} 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Time *</label>
            <input 
              type="time" 
              required 
              value={formData.time} 
              onChange={(e) => setFormData({ ...formData, time: e.target.value })} 
              style={styles.input} 
            />
          </div>

          <div style={{ ...styles.inputGroup, gridColumn: '1 / -1' }}>
            <label style={styles.label}>Purpose</label>
            <input 
              type="text" 
              placeholder="Interview, Client Meeting, etc." 
              value={formData.purpose} 
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })} 
              style={styles.input} 
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <button type="submit" style={styles.btnPrimary}>Schedule Appointment</button>
          </div>
        </form>
      </div>

      <div style={styles.sectionCard}>
        <div style={styles.tableHeader}>
          <h3 style={styles.sectionTitle}>Scheduled Appointments</h3>
          <span style={styles.recordBadge}>{appointments.length} Total</span>
        </div>
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>VISITOR</th>
                <th style={styles.th}>MOBILE</th>
                <th style={styles.th}>MEETING WITH</th>
                <th style={styles.th}>DEPT</th>
                <th style={styles.th}>DATE</th>
                <th style={styles.th}>TIME</th>
                <th style={styles.th}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={styles.emptyTd}>Loading appointments...</td></tr>
              ) : appointments.length > 0 ? (
                appointments.map((a) => (
                  <tr key={a._id || a.id} style={styles.tr}>
                    <td style={styles.tdBold}>{a.visitorName}</td>
                    <td style={styles.td}>{a.mobile}</td>
                    <td style={styles.td}>{a.meetingWith}</td>
                    <td style={styles.td}>{a.department || '-'}</td>
                    <td style={styles.td}>{a.date ? new Date(a.date).toLocaleDateString() : '-'}</td>
                    <td style={styles.td}>{a.time || '-'}</td>
                    <td style={styles.td}>
                      <span style={styles.badgePurple}>{a.status || 'SCHEDULED'}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" style={styles.emptyTd}>No appointments scheduled today.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

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
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 16px 0',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#475569',
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#f8fafc',
    fontSize: '14px',
    color: '#0f172a',
    outline: 'none',
    boxSizing: 'border-box',
  },
  btnPrimary: {
    padding: '12px 24px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '8px',
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  badgePurple: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    color: '#7c3aed',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '700',
  },
};