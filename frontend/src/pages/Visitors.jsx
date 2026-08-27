import React, { useState, useEffect } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Table from '../components/UI/Table';
import Badge from '../components/UI/Badge';
import { UserCheck, Edit2, Trash2, Search, X } from 'lucide-react';

export default function Visitors() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  
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

    if (formData.mobile.length < 10) {
      toast.error('Mobile number must be at least 10 digits.');
      return;
    }

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
      window.dispatchEvent(new Event('APP_DATA_UPDATED'));
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const filteredVisitors = visitors.filter(v => {
    const matchesSearch = (v.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (v.mobile || '').includes(searchTerm) ||
                          (v.personToMeet || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || (v.status || 'INSIDE').toUpperCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { header: 'Name', accessor: 'name', render: (v) => <span className="font-semibold text-text-primary">{v.name}</span> },
    { header: 'Mobile', accessor: 'mobile', render: (v) => <span className="font-mono text-sm">{v.mobile || '-'}</span> },
    { header: 'Host', accessor: 'personToMeet', render: (v) => v.personToMeet || '-' },
    { header: 'Purpose', accessor: 'purpose', render: (v) => v.purpose || '-' },
    { header: 'Status', accessor: 'status', render: (v) => <Badge status={v.status || 'INSIDE'}>{v.status || 'INSIDE'}</Badge> },
    { 
      header: 'Actions', 
      accessor: 'actions', 
      render: (v) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleEdit(v)} 
            className="p-1.5 text-status-info hover:bg-status-infoBg rounded-md transition-colors" 
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => handleDelete(v._id || v.id)} 
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
        <h1 className="page-title">Visitor Management</h1>
        <p className="page-subtitle">Log new entries and track visitors currently on site</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Form Column */}
        <div className="xl:col-span-1">
          <Card className="sticky top-[96px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-text-primary">
                {editingId ? 'Edit Visitor' : 'Check In Visitor'}
              </h3>
              {editingId && (
                <button 
                  type="button" 
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ name: '', mobile: '', personToMeet: '', purpose: '' });
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
                placeholder="John Doe" 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
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
              <div className="mt-4">
                <Button type="submit" loading={submitting} icon={UserCheck} className="w-full">
                  {editingId ? 'Update Visitor' : 'Check In Visitor'}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Table Column */}
        <div className="xl:col-span-2">
          <Card padding="p-0" className="h-full">
            <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-text-primary">Visitor Records</h3>
                <Badge status="info">{filteredVisitors.length}</Badge>
              </div>
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input 
                    type="text" 
                    placeholder="Search visitors..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-surface-secondary border border-border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="py-2 pl-3 pr-8 bg-surface-secondary border border-border rounded-lg text-sm focus:outline-none focus:border-primary appearance-none cursor-pointer"
                  style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%207l5%205%205-5%22%20fill%3D%22none%22%20stroke%3D%22%23475569%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E")', backgroundPosition: 'right 8px center', backgroundRepeat: 'no-repeat' }}
                >
                  <option value="ALL">All Status</option>
                  <option value="INSIDE">Inside</option>
                  <option value="CHECKED OUT">Checked Out</option>
                  <option value="PENDING">Pending</option>
                </select>
              </div>
            </div>
            
            <Table columns={columns} data={filteredVisitors} loading={loading} emptyMessage="No visitors match your criteria." />
          </Card>
        </div>

      </div>
    </div>
  );
}