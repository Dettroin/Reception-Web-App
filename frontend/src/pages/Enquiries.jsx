 import React, { useState, useEffect } from 'react';
import API from '../services/api';

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State keys updated to match your backend Mongoose schema exactly
  const [formData, setFormData] = useState({ 
    name: '', 
    mobile: '', 
    email: '',
    enquiryType: '', 
    message: '',
    assignedTo: '',
    followUpDate: '',
    remarks: ''
  });

  const fetchEnquiries = async () => {
    try {
      const res = await API.get('/enquiries');
      setEnquiries(res.data?.data || res.data || []);
    } catch (err) {
      console.error('Error loading enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchEnquiries(); 
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.mobile.length !== 10) {
      alert('Mobile number must be exactly 10 digits.');
      return;
    }

    try {
      await API.post('/enquiries', formData);
      
      // Reset form state after successful submission
      setFormData({ 
        name: '', 
        mobile: '', 
        email: '',
        enquiryType: '', 
        message: '',
        assignedTo: '',
        followUpDate: '',
        remarks: ''
      });
      fetchEnquiries();
    } catch (err) {
      console.error('API Error Details:', err.response?.data || err);
      alert(err.response?.data?.message || 'Failed to log enquiry.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Enquiries</h1>
        <p style={styles.headerSubtitle}>Log and resolve front-desk queries</p>
      </div>

      <div style={styles.sectionCard}>
        <h3 style={styles.sectionTitle}>Log New Enquiry</h3>
        <form onSubmit={handleSubmit} style={styles.formGrid}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Caller / Person Name *</label>
            <input 
              type="text" 
              required 
              placeholder="Jane Smith" 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              style={styles.input} 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Mobile Number *</label>
            <input 
              type="tel" 
              required 
              placeholder="10-digit number" 
              minLength={10}
              maxLength={10}
              value={formData.mobile} 
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/\D/g, '');
                if (digitsOnly.length <= 10) {
                  setFormData({ ...formData, mobile: digitsOnly });
                }
              }} 
              style={styles.input} 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input 
              type="email" 
              placeholder="jane@example.com" 
              value={formData.email} 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
              style={styles.input} 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Enquiry Category</label>
            <input 
              type="text" 
              placeholder="Billing / Support / Admission" 
              value={formData.enquiryType} 
              onChange={(e) => setFormData({ ...formData, enquiryType: e.target.value })} 
              style={styles.input} 
            />
          </div>

          <div style={{ ...styles.inputGroup, gridColumn: '1 / -1' }}>
            <label style={styles.label}>Message / Details *</label>
            <input 
              type="text" 
              required 
              placeholder="Summary of query or question..." 
              value={formData.message} 
              onChange={(e) => setFormData({ ...formData, message: e.target.value })} 
              style={styles.input} 
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <button type="submit" style={styles.btnPrimary}>Submit Enquiry</button>
          </div>
        </form>
      </div>

      <div style={styles.sectionCard}>
        <div style={styles.tableHeader}>
          <h3 style={styles.sectionTitle}>Pending & Resolved Enquiries</h3>
          <span style={styles.recordBadge}>{enquiries.length} Total</span>
        </div>
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>NAME</th>
                <th style={styles.th}>MOBILE</th>
                <th style={styles.th}>EMAIL</th>
                <th style={styles.th}>CATEGORY</th>
                <th style={styles.th}>MESSAGE</th>
                <th style={styles.th}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={styles.emptyTd}>Loading enquiries...</td></tr>
              ) : enquiries.length > 0 ? (
                enquiries.map((e) => (
                  <tr key={e._id || e.id} style={styles.tr}>
                    <td style={styles.tdBold}>{e.name}</td>
                    <td style={styles.td}>{e.mobile || '-'}</td>
                    <td style={styles.td}>{e.email || '-'}</td>
                    <td style={styles.td}>{e.enquiryType || 'General'}</td>
                    <td style={styles.td}>{e.message || '-'}</td>
                    <td style={styles.td}>
                      <span style={e.status === 'RESOLVED' ? styles.badgeSuccess : styles.badgeWarning}>
                        {e.status || 'NEW'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" style={styles.emptyTd}>No enquiries logged.</td></tr>
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
  badgeSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    color: '#059669',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '700',
  },
  badgeWarning: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    color: '#d97706',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '700',
  },
};