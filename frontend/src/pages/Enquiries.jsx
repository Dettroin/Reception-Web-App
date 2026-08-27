import React, { useState, useEffect } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Table from '../components/UI/Table';
import Badge from '../components/UI/Badge';
import { Send, Edit2, Trash2, Search, X } from 'lucide-react';

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
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
      toast.error('Failed to load enquiries.');
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
      toast.error('Mobile number must be exactly 10 digits.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await API.patch(`/enquiries/${editingId}`, formData);
        toast.success('Enquiry updated successfully.');
      } else {
        await API.post('/enquiries', formData);
        toast.success('Enquiry logged successfully.');
      }
      window.dispatchEvent(new Event('APP_DATA_UPDATED'));
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
      setEditingId(null);
      fetchEnquiries();
    } catch (err) {
      console.error('API Error Details:', err.response?.data || err);
      toast.error(err.response?.data?.message || `Failed to ${editingId ? 'update' : 'log'} enquiry.`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (enquiry) => {
    setFormData({
      name: enquiry.name || '',
      mobile: enquiry.mobile || '',
      email: enquiry.email || '',
      enquiryType: enquiry.enquiryType || '',
      message: enquiry.message || '',
      assignedTo: enquiry.assignedTo || '',
      followUpDate: enquiry.followUpDate ? new Date(enquiry.followUpDate).toISOString().split('T')[0] : '',
      remarks: enquiry.remarks || '',
    });
    setEditingId(enquiry._id || enquiry.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      await API.delete(`/enquiries/${id}`);
      toast.success('Enquiry deleted successfully.');
      fetchEnquiries();
    } catch (err) {
      console.error('Error deleting enquiry:', err);
      toast.error('Failed to delete enquiry.');
    }
  };

  const filteredEnquiries = enquiries.filter(e => {
    const matchesSearch = (e.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (e.mobile || '').includes(searchTerm) ||
                          (e.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const columns = [
    { header: 'Name', accessor: 'name', render: (e) => <span className="font-semibold text-text-primary">{e.name}</span> },
    { header: 'Mobile', accessor: 'mobile', render: (e) => <span className="font-mono text-sm">{e.mobile || '-'}</span> },
    { header: 'Email', accessor: 'email', render: (e) => e.email || '-' },
    { header: 'Category', accessor: 'enquiryType', render: (e) => e.enquiryType || 'General' },
    { header: 'Message', accessor: 'message', render: (e) => e.message || '-' },
    { header: 'Status', accessor: 'status', render: (e) => <Badge status={e.status || 'NEW'}>{e.status || 'NEW'}</Badge> },
    { 
      header: 'Actions', 
      accessor: 'actions', 
      render: (e) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleEdit(e)} 
            className="p-1.5 text-status-info hover:bg-status-infoBg rounded-md transition-colors" 
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => handleDelete(e._id || e.id)} 
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
        <h1 className="page-title">Enquiries</h1>
        <p className="page-subtitle">Log and resolve front-desk queries</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1">
          <Card className="sticky top-[96px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-text-primary">
                {editingId ? 'Edit Enquiry' : 'Log New Enquiry'}
              </h3>
              {editingId && (
                <button 
                  type="button" 
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ name: '', mobile: '', email: '', enquiryType: '', message: '', assignedTo: '', followUpDate: '', remarks: '' });
                  }}
                  className="text-xs font-semibold text-status-danger hover:underline flex items-center gap-1"
                >
                  <X size={14} /> Cancel
                </button>
              )}
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-1">
              <Input 
                label="Caller / Person Name" 
                required 
                placeholder="Jane Smith" 
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
                label="Email" 
                type="email"
                placeholder="jane@example.com" 
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
              />
              <Input 
                label="Enquiry Category" 
                placeholder="Billing / Support / Admission" 
                value={formData.enquiryType} 
                onChange={(e) => setFormData({ ...formData, enquiryType: e.target.value })} 
              />
              <Input 
                label="Message / Details" 
                required 
                placeholder="Summary of query or question..." 
                value={formData.message} 
                onChange={(e) => setFormData({ ...formData, message: e.target.value })} 
              />
              <div className="mt-4">
                <Button type="submit" loading={submitting} icon={Send} className="w-full">
                  {editingId ? 'Update Enquiry' : 'Submit Enquiry'}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <div className="xl:col-span-2">
          <Card padding="p-0" className="h-full">
            <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-text-primary">Enquiry Records</h3>
                <Badge status="info">{filteredEnquiries.length}</Badge>
              </div>
              
              <div className="relative w-full sm:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input 
                  type="text" 
                  placeholder="Search enquiries..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-surface-secondary border border-border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
            <Table columns={columns} data={filteredEnquiries} loading={loading} emptyMessage="No enquiries found." />
          </Card>
        </div>
      </div>
    </div>
  );
}