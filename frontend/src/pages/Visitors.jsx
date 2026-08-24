 import React, { useState, useEffect } from 'react';
import API from '../services/api';

export default function Visitors() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    personToMeet: '',
    purpose: '',
  });

  const fetchVisitors = async () => {
    try {
      const res = await API.get('/visitors');
      setVisitors(res.data?.data || res.data || []);
    } catch (err) {
      console.error('Error loading visitors:', err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/visitors', formData);
      if (res.data?.success || res.status === 200 || res.status === 201) {
        setFormData({ name: '', mobile: '', personToMeet: '', purpose: '' });
        fetchVisitors();
      }
    } catch (err) {
      console.error('Submission Error Details:', err.response?.data || err);
      const serverMsg = err.response?.data?.message || err.response?.data?.error || err.message;

      if (err.response?.status === 401) {
        alert(`Authentication Failed (401): ${serverMsg}\n\nPlease log out and log back in to refresh your token.`);
      } else {
        alert(`Failed to check in visitor: ${serverMsg}`);
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Visitor Management</h1>
        <p style={styles.headerSubtitle}>Log new entries and track visitors currently on site</p>
      </div>

      <div style={styles.sectionCard}>
        <h3 style={styles.sectionTitle}>Check In New Visitor</h3>
        <form onSubmit={handleSubmit} style={styles.formGrid}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Visitor Name</label>
            <input
              type="text"
              required
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Mobile Number</label>
            <input
              type="text"
              required
              placeholder="+1 234 567 890"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Person To Meet</label>
            <input
              type="text"
              required
              placeholder="Sarah Connor"
              value={formData.personToMeet}
              onChange={(e) => setFormData({ ...formData, personToMeet: e.target.value })}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Purpose</label>
            <input
              type="text"
              required
              placeholder="Interview / Meeting"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              style={styles.input}
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <button type="submit" style={styles.btnPrimary}>Check In Visitor</button>
          </div>
        </form>
      </div>

      <div style={styles.sectionCard}>
        <div style={styles.tableHeader}>
          <h3 style={styles.sectionTitle}>Visitor Records</h3>
          <span style={styles.recordBadge}>{visitors.length} Total</span>
        </div>
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>NAME</th>
                <th style={styles.th}>MOBILE</th>
                <th style={styles.th}>PERSON TO MEET</th>
                <th style={styles.th}>PURPOSE</th>
                <th style={styles.th}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={styles.emptyTd}>Loading visitors...</td></tr>
              ) : visitors.length > 0 ? (
                visitors.map((v) => (
                  <tr key={v._id || v.id} style={styles.tr}>
                    <td style={styles.tdBold}>{v.name}</td>
                    <td style={styles.td}>{v.mobile || '-'}</td>
                    <td style={styles.td}>{v.personToMeet || '-'}</td>
                    <td style={styles.td}>{v.purpose || '-'}</td>
                    <td style={styles.td}>
                      <span style={v.status === 'INSIDE' ? styles.badgeSuccess : styles.badgeMuted}>
                        {v.status || 'INSIDE'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" style={styles.emptyTd}>No visitors recorded today.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1400px', margin: '0 auto' },
  header: { marginBottom: '4px' },
  headerTitle: { fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' },
  headerSubtitle: { fontSize: '14px', color: '#64748b', margin: 0 },
  sectionCard: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' },
  sectionTitle: { fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: '0 0 16px 0' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase' },
  input: { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '14px', color: '#0f172a', outline: 'none', boxSizing: 'border-box' },
  btnPrimary: { padding: '12px 24px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', marginTop: '8px' },
  tableHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  recordBadge: { fontSize: '12px', fontWeight: '600', color: '#64748b', backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '6px' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#64748b', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '14px 16px', fontSize: '14px', color: '#334155' },
  tdBold: { padding: '14px 16px', fontSize: '14px', fontWeight: '600', color: '#0f172a' },
  emptyTd: { padding: '24px 16px', fontSize: '14px', color: '#94a3b8', textAlign: 'center' },
  badgeSuccess: { backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#059669', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' },
  badgeMuted: { backgroundColor: '#f1f5f9', color: '#64748b', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' },
};