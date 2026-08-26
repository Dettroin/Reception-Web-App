 import React, { useState, useEffect } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Table from '../components/UI/Table';
import Badge from '../components/UI/Badge';
import { UserCheck, Edit2, Trash2 } from 'lucide-react';

export default function Visitors() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
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
      toast.error('Failed to load visitors.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        const res = await API.patch(`/visitors/${editingId}`, formData);
        if (res.data?.success || res.status === 200 || res.status === 201) {
          toast.success('Visitor updated successfully.');
        }
      } else {
        const res = await API.post('/visitors', formData);
        if (res.data?.success || res.status === 200 || res.status === 201) {
          toast.success('Visitor checked in successfully.');
        }
      }
      setFormData({ name: '', mobile: '', personToMeet: '', purpose: '' });
      setEditingId(null);
      fetchVisitors();
    } catch (err) {
      console.error('Submission Error Details:', err.response?.data || err);
      const serverMsg = err.response?.data?.message || err.response?.data?.error || err.message;
      if (err.response?.status === 401) {
        toast.error(`Authentication Failed. Please log in again.`);
      } else {
        toast.error(`Failed to ${editingId ? 'update' : 'check in'} visitor: ${serverMsg}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (visitor) => {
    setFormData({
      name: visitor.name || '',
      mobile: visitor.mobile || '',
      personToMeet: visitor.personToMeet || '',
      purpose: visitor.purpose || '',
    });
    setEditingId(visitor._id || visitor.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this visitor?')) return;
    try {
      await API.delete(`/visitors/${id}`);
      toast.success('Visitor deleted successfully.');
      fetchVisitors();
    } catch (err) {
      console.error('Error deleting visitor:', err);
      toast.error('Failed to delete visitor.');
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name', render: (v) => <span style={{ fontWeight: 500 }}>{v.name}</span> },
    { header: 'Mobile', accessor: 'mobile', render: (v) => v.mobile || '-' },
    { header: 'Host', accessor: 'personToMeet', render: (v) => v.personToMeet || '-' },
    { header: 'Purpose', accessor: 'purpose', render: (v) => v.purpose || '-' },
    { header: 'Status', accessor: 'status', render: (v) => <Badge status={v.status || 'INSIDE'}>{v.status || 'INSIDE'}</Badge> },
    { 
      header: 'Actions', 
      accessor: 'actions', 
      render: (v) => (
        <div className="flex gap-2">
          <button onClick={() => handleEdit(v)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#3b82f6' }} title="Edit">
            <Edit2 size={16} />
          </button>
          <button onClick={() => handleDelete(v._id || v.id)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#ef4444' }} title="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      ) 
    }
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="page-title">Visitor Management</h1>
        <p className="page-subtitle">Log new entries and track visitors currently on site</p>
      </div>

      <div className="grid grid-cols-3 gap-6 md:grid-cols-1">
        {/* Form Card */}
        <Card className="span-1">
          <div className="flex justify-between items-center mb-4">
            <h3 className="section-title" style={{ margin: 0 }}>
              {editingId ? 'Edit Visitor' : 'Check In Visitor'}
            </h3>
            {editingId && (
              <button 
                type="button" 
                onClick={() => {
                  setEditingId(null);
                  setFormData({ name: '', mobile: '', personToMeet: '', purpose: '' });
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
              placeholder="John Doe" 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            />
            <Input 
              label="Mobile Number" 
              required 
              placeholder="+1 234 567 890" 
              value={formData.mobile} 
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} 
            />
            <Input 
              label="Person To Meet" 
              required 
              placeholder="Sarah Connor" 
              value={formData.personToMeet} 
              onChange={(e) => setFormData({ ...formData, personToMeet: e.target.value })} 
            />
            <Input 
              label="Purpose" 
              required 
              placeholder="Interview / Meeting" 
              value={formData.purpose} 
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })} 
            />
            <div style={{ marginTop: '8px' }}>
              <Button type="submit" loading={submitting} icon={UserCheck}>
                {editingId ? 'Update Visitor' : 'Check In Visitor'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Table Card */}
        <Card className="span-2">
          <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
            <h3 className="section-title" style={{ margin: 0 }}>Visitor Records</h3>
            <Badge status="default">{visitors.length} Total</Badge>
          </div>
          <Table columns={columns} data={visitors} loading={loading} emptyMessage="No visitors recorded today." />
        </Card>
      </div>
    </div>
  );
}