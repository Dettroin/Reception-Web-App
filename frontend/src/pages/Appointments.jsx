 import React, { useState, useEffect } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Table from '../components/UI/Table';
import Badge from '../components/UI/Badge';
import { CalendarPlus, Edit2, Trash2 } from 'lucide-react';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
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
    setSubmitting(true);
    try {
      if (editingId) {
        await API.patch(`/appointments/${editingId}`, formData);
        toast.success('Appointment updated successfully.');
      } else {
        await API.post('/appointments', formData);
        toast.success('Appointment scheduled successfully.');
      }
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

  const columns = [
    { header: 'Visitor', accessor: 'visitorName', render: (a) => <span style={{ fontWeight: 500 }}>{a.visitorName}</span> },
    { header: 'Mobile', accessor: 'mobile', render: (a) => a.mobile || '-' },
    { header: 'Meeting With', accessor: 'meetingWith', render: (a) => a.meetingWith || '-' },
    { header: 'Dept', accessor: 'department', render: (a) => a.department || '-' },
    { header: 'Date', accessor: 'date', render: (a) => a.date ? new Date(a.date).toLocaleDateString() : '-' },
    { header: 'Time', accessor: 'time', render: (a) => a.time || '-' },
    { header: 'Status', accessor: 'status', render: (a) => <Badge status={a.status || 'SCHEDULED'}>{a.status || 'SCHEDULED'}</Badge> },
    { 
      header: 'Actions', 
      accessor: 'actions', 
      render: (a) => (
        <div className="flex gap-2">
          <button onClick={() => handleEdit(a)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#3b82f6' }} title="Edit">
            <Edit2 size={16} />
          </button>
          <button onClick={() => handleDelete(a._id || a.id)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#ef4444' }} title="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      ) 
    }
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="page-title">Appointments</h1>
        <p className="page-subtitle">Schedule and oversee upcoming visitor meetings</p>
      </div>

      <div className="grid grid-cols-3 gap-6 md:grid-cols-1">
        <Card className="span-1">
          <div className="flex justify-between items-center mb-4">
            <h3 className="section-title" style={{ margin: 0 }}>
              {editingId ? 'Edit Appointment' : 'Schedule New Appointment'}
            </h3>
            {editingId && (
              <button 
                type="button" 
                onClick={() => {
                  setEditingId(null);
                  setFormData({ visitorName: '', mobile: '', meetingWith: '', department: '', date: '', time: '', purpose: '' });
                }}
                style={{ fontSize: '12px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Cancel Edit
              </button>
            )}
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
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
              placeholder="9876543210" 
              value={formData.mobile} 
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} 
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
            <div style={{ marginTop: '8px' }}>
              <Button type="submit" loading={submitting} icon={CalendarPlus}>
                {editingId ? 'Update Appointment' : 'Schedule Appointment'}
              </Button>
            </div>
          </form>
        </Card>

        <Card className="span-2">
          <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
            <h3 className="section-title" style={{ margin: 0 }}>Scheduled Appointments</h3>
            <Badge status="default">{appointments.length} Total</Badge>
          </div>
          <Table columns={columns} data={appointments} loading={loading} emptyMessage="No appointments scheduled." />
        </Card>
      </div>
    </div>
  );
}
