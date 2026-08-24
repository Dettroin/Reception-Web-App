 import React, { useState, useEffect } from 'react';
import API from '../services/api';

export default function Calls() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    callerName: '',
    mobile: '',
    callType: 'Incoming',
    personOrDepartment: '',
    purpose: '',
    remarks: ''
  });

  const fetchLogs = async () => {
    try {
      const res = await API.get('/calls');
      setLogs(res.data?.data || res.data || []);
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.mobile.length < 10) {
      alert('Mobile number must be at least 10 digits.');
      return;
    }

    // Send empty strings instead of undefined to maintain keys in Axios JSON
    const payload = {
      callerName: formData.callerName.trim(),
      mobile: formData.mobile.trim(),
      callType: formData.callType,
      personOrDepartment: formData.personOrDepartment.trim(),
      purpose: formData.purpose.trim(),
      remarks: formData.remarks.trim(),
      dateTime: new Date().toISOString()
    };

    try {
      await API.post('/calls', payload);
      setFormData({
        callerName: '',
        mobile: '',
        callType: 'Incoming',
        personOrDepartment: '',
        purpose: '',
        remarks: ''
      });
      fetchLogs();
    } catch (err) {
      console.error('Full Server Error:', err.response?.data);

      const rawError = err.response?.data;
      const errorMsg = 
        (typeof rawError === 'string' ? rawError : null) ||
        rawError?.message || 
        rawError?.error || 
        JSON.stringify(rawError) || 
        'Failed to log call.';

      alert(`Error Details: ${errorMsg}`);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Call Logs</h1>

      <div style={styles.card}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Caller Name *"
            required
            value={formData.callerName}
            onChange={(e) => setFormData({ ...formData, callerName: e.target.value })}
            style={styles.input}
          />

          <input
            type="tel"
            placeholder="Mobile Number *"
            required
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

          <select
            value={formData.callType}
            onChange={(e) => setFormData({ ...formData, callType: e.target.value })}
            style={styles.input}
          >
            <option value="Incoming">Incoming</option>
            <option value="Outgoing">Outgoing</option>
            <option value="Missed">Missed</option>
          </select>

          <input
            type="text"
            placeholder="Person / Department"
            value={formData.personOrDepartment}
            onChange={(e) => setFormData({ ...formData, personOrDepartment: e.target.value })}
            style={styles.input}
          />

          <input
            type="text"
            placeholder="Call Purpose / Remarks"
            value={formData.purpose}
            onChange={(e) => setFormData({ ...formData, purpose: e.target.value, remarks: e.target.value })}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>Log Call</button>
        </form>
      </div>

      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>CALLER</th>
              <th style={styles.th}>MOBILE</th>
              <th style={styles.th}>TYPE</th>
              <th style={styles.th}>TARGET PERSON / DEPT</th>
              <th style={styles.th}>PURPOSE</th>
              <th style={styles.th}>DATE & TIME</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={styles.tdCenter}>Loading...</td></tr>
            ) : logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log._id || log.id}>
                  <td style={styles.td}>{log.callerName}</td>
                  <td style={styles.td}>{log.mobile}</td>
                  <td style={styles.td}>{log.callType}</td>
                  <td style={styles.td}>{log.personOrDepartment || '-'}</td>
                  <td style={styles.td}>{log.purpose || log.remarks || '-'}</td>
                  <td style={styles.td}>
                    {log.dateTime ? new Date(log.dateTime).toLocaleString() : '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" style={styles.tdCenter}>No call logs found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' },
  title: { fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' },
  card: { backgroundColor: '#fff', borderRadius: '8px', padding: '20px', border: '1px solid #e2e8f0', marginBottom: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '350px' },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' },
  button: { padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '10px', fontSize: '12px', color: '#64748b', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
  td: { padding: '10px', fontSize: '14px', borderBottom: '1px solid #f1f5f9' },
  tdCenter: { padding: '20px', textAlign: 'center', color: '#94a3b8' }
};