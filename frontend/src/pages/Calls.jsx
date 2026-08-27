import React, { useState, useEffect } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Select from '../components/UI/Select';
import Table from '../components/UI/Table';
import Badge from '../components/UI/Badge';
import { PhoneCall, Edit2, Trash2, Search, X } from 'lucide-react';

export default function Calls() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  
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
      window.dispatchEvent(new Event('APP_DATA_UPDATED'));
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const filteredLogs = logs.filter(log => {
    const matchesSearch = (log.callerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (log.mobile || '').includes(searchTerm) ||
                          (log.personOrDepartment || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || log.callType === filterType;
    return matchesSearch && matchesType;
  });

  const columns = [
    { header: 'Caller', accessor: 'callerName', render: (log) => <span className="font-semibold text-text-primary">{log.callerName}</span> },
    { header: 'Mobile', accessor: 'mobile', render: (log) => <span className="font-mono text-sm">{log.mobile}</span> },
    { header: 'Type', accessor: 'callType', render: (log) => <Badge status={getCallBadgeStatus(log.callType)}>{log.callType}</Badge> },
    { header: 'Target Person/Dept', accessor: 'personOrDepartment', render: (log) => log.personOrDepartment || '-' },
    { header: 'Purpose', accessor: 'purpose', render: (log) => log.purpose || log.remarks || '-' },
    { header: 'Date & Time', accessor: 'dateTime', render: (log) => log.dateTime ? new Date(log.dateTime).toLocaleString() : '-' },
    { 
      header: 'Actions', 
      accessor: 'actions', 
      render: (log) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleEdit(log)} 
            className="p-1.5 text-status-info hover:bg-status-infoBg rounded-md transition-colors" 
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => handleDelete(log._id || log.id)} 
            className="p-1.5 text-status-danger hover:bg-status-dangerBg rounded-md transition-colors" 
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ) 
    }
  ];

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div>
        <h1 className="page-title">Call Logs</h1>
        <p className="page-subtitle">Log incoming and outgoing calls</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1">
          <Card className="sticky top-[96px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-text-primary">
                {editingId ? 'Edit Call' : 'Log New Call'}
              </h3>
              {editingId && (
                <button 
                  type="button" 
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ callerName: '', mobile: '', callType: 'Incoming', personOrDepartment: '', purpose: '', remarks: '' });
                  }}
                  className="text-xs font-semibold text-status-danger hover:underline flex items-center gap-1"
                >
                  <X size={14} /> Cancel
                </button>
              )}
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-1">
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
              <div className="mt-4">
                <Button type="submit" loading={submitting} icon={PhoneCall} className="w-full">
                  {editingId ? 'Update Call' : 'Log Call'}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <div className="xl:col-span-2">
          <Card padding="p-0" className="h-full">
            <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-text-primary">Recent Calls</h3>
                <Badge status="info">{filteredLogs.length}</Badge>
              </div>
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input 
                    type="text" 
                    placeholder="Search calls..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-surface-secondary border border-border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="py-2 pl-3 pr-8 bg-surface-secondary border border-border rounded-lg text-sm focus:outline-none focus:border-primary appearance-none cursor-pointer"
                  style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%207l5%205%205-5%22%20fill%3D%22none%22%20stroke%3D%22%23475569%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E")', backgroundPosition: 'right 8px center', backgroundRepeat: 'no-repeat' }}
                >
                  <option value="ALL">All Types</option>
                  <option value="Incoming">Incoming</option>
                  <option value="Outgoing">Outgoing</option>
                  <option value="Missed">Missed</option>
                </select>
              </div>
            </div>
            <Table columns={columns} data={filteredLogs} loading={loading} emptyMessage="No call logs match your criteria." />
          </Card>
        </div>
      </div>
    </div>
  );
}