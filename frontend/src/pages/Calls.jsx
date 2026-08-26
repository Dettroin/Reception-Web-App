 import React, { useState, useEffect } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Select from '../components/UI/Select';
import Table from '../components/UI/Table';
import Badge from '../components/UI/Badge';
import { PhoneCall, Edit2, Trash2 } from 'lucide-react';

export default function Calls() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
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
      toast.error('Failed to load call logs.');
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
      toast.error('Mobile number must be at least 10 digits.');
      return;
    }

    const payload = {
      callerName: formData.callerName.trim(),
      mobile: formData.mobile.trim(),
      callType: formData.callType,
      personOrDepartment: formData.personOrDepartment.trim(),
      purpose: formData.purpose.trim(),
      remarks: formData.remarks.trim(),
      dateTime: new Date().toISOString()
    };

    setSubmitting(true);
    try {
      if (editingId) {
        await API.patch(`/calls/${editingId}`, payload);
        toast.success('Call updated successfully.');
      } else {
        await API.post('/calls', payload);
        toast.success('Call logged successfully.');
      }
      setFormData({
        callerName: '',
        mobile: '',
        callType: 'Incoming',
        personOrDepartment: '',
        purpose: '',
        remarks: ''
      });
      setEditingId(null);
      fetchLogs();
    } catch (err) {
      console.error('Full Server Error:', err.response?.data);
      const rawError = err.response?.data;
      const errorMsg = 
        (typeof rawError === 'string' ? rawError : null) ||
        rawError?.message || 
        rawError?.error || 
        `Failed to ${editingId ? 'update' : 'log'} call.`;
      toast.error(`Error: ${errorMsg}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (log) => {
    setFormData({
      callerName: log.callerName || '',
      mobile: log.mobile || '',
      callType: log.callType || 'Incoming',
      personOrDepartment: log.personOrDepartment || '',
      purpose: log.purpose || '',
      remarks: log.remarks || '',
    });
    setEditingId(log._id || log.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this call log?')) return;
    try {
      await API.delete(`/calls/${id}`);
      toast.success('Call deleted successfully.');
      fetchLogs();
    } catch (err) {
      console.error('Error deleting call:', err);
      toast.error('Failed to delete call.');
    }
  };

  const getCallBadgeStatus = (type) => {
    if (type === 'Incoming') return 'info';
    if (type === 'Outgoing') return 'success';
    if (type === 'Missed') return 'danger';
    return 'default';
  };

  const columns = [
    { header: 'Caller', accessor: 'callerName', render: (log) => <span style={{ fontWeight: 500 }}>{log.callerName}</span> },
    { header: 'Mobile', accessor: 'mobile', render: (log) => log.mobile },
    { header: 'Type', accessor: 'callType', render: (log) => <Badge status={getCallBadgeStatus(log.callType)}>{log.callType}</Badge> },
    { header: 'Target Person/Dept', accessor: 'personOrDepartment', render: (log) => log.personOrDepartment || '-' },
    { header: 'Purpose', accessor: 'purpose', render: (log) => log.purpose || log.remarks || '-' },
    { header: 'Date & Time', accessor: 'dateTime', render: (log) => log.dateTime ? new Date(log.dateTime).toLocaleString() : '-' },
    { 
      header: 'Actions', 
      accessor: 'actions', 
      render: (log) => (
        <div className="flex gap-2">
          <button onClick={() => handleEdit(log)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#3b82f6' }} title="Edit">
            <Edit2 size={16} />
          </button>
          <button onClick={() => handleDelete(log._id || log.id)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#ef4444' }} title="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      ) 
    }
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="page-title">Call Logs</h1>
        <p className="page-subtitle">Log incoming and outgoing calls</p>
      </div>

      <div className="grid grid-cols-3 gap-6 md:grid-cols-1">
        <Card className="span-1">
          <div className="flex justify-between items-center mb-4">
            <h3 className="section-title" style={{ margin: 0 }}>
              {editingId ? 'Edit Call' : 'Log New Call'}
            </h3>
            {editingId && (
              <button 
                type="button" 
                onClick={() => {
                  setEditingId(null);
                  setFormData({ callerName: '', mobile: '', callType: 'Incoming', personOrDepartment: '', purpose: '', remarks: '' });
                }}
                style={{ fontSize: '12px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Cancel Edit
              </button>
            )}
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <Input 
              label="Caller Name" 
              required 
              placeholder="Caller Name" 
              value={formData.callerName} 
              onChange={(e) => setFormData({ ...formData, callerName: e.target.value })} 
            />
            <Input 
              label="Mobile Number" 
              required 
              type="tel"
              placeholder="10-digit number" 
              minLength={10} 
              maxLength={10} 
              value={formData.mobile} 
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/\D/g, '');
                if (digitsOnly.length <= 10) setFormData({ ...formData, mobile: digitsOnly });
              }} 
            />
            <Select 
              label="Call Type" 
              options={[
                { value: 'Incoming', label: 'Incoming' },
                { value: 'Outgoing', label: 'Outgoing' },
                { value: 'Missed', label: 'Missed' }
              ]}
              value={formData.callType} 
              onChange={(e) => setFormData({ ...formData, callType: e.target.value })} 
            />
            <Input 
              label="Person / Department" 
              placeholder="Person or Department" 
              value={formData.personOrDepartment} 
              onChange={(e) => setFormData({ ...formData, personOrDepartment: e.target.value })} 
            />
            <Input 
              label="Call Purpose / Remarks" 
              placeholder="Call Purpose or Remarks" 
              value={formData.purpose} 
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value, remarks: e.target.value })} 
            />
            <div style={{ marginTop: '8px' }}>
              <Button type="submit" loading={submitting} icon={PhoneCall}>
                {editingId ? 'Update Call' : 'Log Call'}
              </Button>
            </div>
          </form>
        </Card>

        <Card className="span-2">
          <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
            <h3 className="section-title" style={{ margin: 0 }}>Recent Calls</h3>
            <Badge status="default">{logs.length} Total</Badge>
          </div>
          <Table columns={columns} data={logs} loading={loading} emptyMessage="No call logs found." />
        </Card>
      </div>
    </div>
  );
}
