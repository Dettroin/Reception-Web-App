import React, { useState, useEffect } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Table from '../components/UI/Table';
import Badge from '../components/UI/Badge';
import { CalendarPlus, Edit2, Trash2, Search, X } from 'lucide-react';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
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
      toast.error('Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchAppointments(); 
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.mobile.length < 10) {
      toast.error('Mobile number must be at least 10 digits.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await API.patch(`/appointments/${editingId}`, formData);
        toast.success('Appointment updated successfully.');
      } else {
        await API.post('/appointments', formData);
        toast.success('Appointment scheduled successfully.');
      }
      window.dispatchEvent(new Event('APP_DATA_UPDATED'));
      setFormData({ 
        visitorName: '', 
        mobile: '', 
        meetingWith: '', 
        department: '', 
        date: '', 
        time: '', 
        purpose: '' 
      });
      setEditingId(null);
      fetchAppointments();
    } catch (err) {
      console.error('API Error Details:', err.response?.data || err);
      toast.error(err.response?.data?.message || `Failed to ${editingId ? 'update' : 'schedule'} appointment.`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (appointment) => {
    setFormData({
      visitorName: appointment.visitorName || '',
      mobile: appointment.mobile || '',
      meetingWith: appointment.meetingWith || '',
      department: appointment.department || '',
      date: appointment.date ? new Date(appointment.date).toISOString().split('T')[0] : '',
      time: appointment.time || '',
      purpose: appointment.purpose || '',
    });
    setEditingId(appointment._id || appointment.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      await API.delete(`/appointments/${id}`);
      toast.success('Appointment deleted successfully.');
      fetchAppointments();
    } catch (err) {
      console.error('Error deleting appointment:', err);
      toast.error('Failed to delete appointment.');
    }
  };

  const filteredAppointments = appointments.filter(a => {
    const matchesSearch = (a.visitorName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (a.mobile || '').includes(searchTerm) ||
                          (a.meetingWith || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const columns = [
    { header: 'Visitor', accessor: 'visitorName', render: (a) => <span className="font-semibold text-text-primary">{a.visitorName}</span> },
    { header: 'Mobile', accessor: 'mobile', render: (a) => <span className="font-mono text-sm">{a.mobile || '-'}</span> },
    { header: 'Meeting With', accessor: 'meetingWith', render: (a) => a.meetingWith || '-' },
    { header: 'Dept', accessor: 'department', render: (a) => a.department || '-' },
    { header: 'Date', accessor: 'date', render: (a) => a.date ? new Date(a.date).toLocaleDateString() : '-' },
    { header: 'Time', accessor: 'time', render: (a) => a.time || '-' },
    { header: 'Status', accessor: 'status', render: (a) => <Badge status={a.status || 'SCHEDULED'}>{a.status || 'SCHEDULED'}</Badge> },
    { 
      header: 'Actions', 
      accessor: 'actions', 
      render: (a) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleEdit(a)} 
            className="p-1.5 text-status-info hover:bg-status-infoBg rounded-md transition-colors" 
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => handleDelete(a._id || a.id)} 
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
        <h1 className="page-title">Appointments</h1>
        <p className="page-subtitle">Schedule and oversee upcoming visitor meetings</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1">
          <Card className="sticky top-[96px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-text-primary">
                {editingId ? 'Edit Appointment' : 'Schedule Appointment'}
              </h3>
              {editingId && (
                <button 
                  type="button" 
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ visitorName: '', mobile: '', meetingWith: '', department: '', date: '', time: '', purpose: '' });
                  }}
                  className="text-xs font-semibold text-status-danger hover:underline flex items-center gap-1"
                >
                  <X size={14} /> Cancel
                </button>
              )}
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-1">
              <Input 
                label="Visitor Name" 
                required 
                placeholder="Alice Johnson" 
                value={formData.visitorName} 
                onChange={(e) => setFormData({ ...formData, visitorName: e.target.value })} 
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
              <Input 
                label="Meeting With (Host)" 
                required 
                placeholder="Manager Name" 
                value={formData.meetingWith} 
                onChange={(e) => setFormData({ ...formData, meetingWith: e.target.value })} 
              />
              <Input 
                label="Department" 
                placeholder="HR / IT / Admin" 
                value={formData.department} 
                onChange={(e) => setFormData({ ...formData, department: e.target.value })} 
              />
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Date" 
                  required 
                  type="date"
                  value={formData.date} 
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })} 
                />
                <Input 
                  label="Time" 
                  required 
                  type="time"
                  value={formData.time} 
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })} 
                />
              </div>
              <Input 
                label="Purpose" 
                placeholder="Interview, Client Meeting, etc." 
                value={formData.purpose} 
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })} 
              />
              <div className="mt-4">
                <Button type="submit" loading={submitting} icon={CalendarPlus} className="w-full">
                  {editingId ? 'Update Appointment' : 'Schedule Appointment'}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <div className="xl:col-span-2">
          <Card padding="p-0" className="h-full">
            <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-text-primary">Scheduled Appointments</h3>
                <Badge status="info">{filteredAppointments.length}</Badge>
              </div>
              
              <div className="relative w-full sm:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input 
                  type="text" 
                  placeholder="Search appointments..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-surface-secondary border border-border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
            <Table columns={columns} data={filteredAppointments} loading={loading} emptyMessage="No appointments found." />
          </Card>
        </div>
      </div>
    </div>
  );
}