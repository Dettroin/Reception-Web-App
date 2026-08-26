 import React, { useState, useEffect } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Table from '../components/UI/Table';
import Badge from '../components/UI/Badge';
import { Send, Edit2, Trash2 } from 'lucide-react';

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
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

  const columns = [
    { header: 'Name', accessor: 'name', render: (e) => <span style={{ fontWeight: 500 }}>{e.name}</span> },
    { header: 'Mobile', accessor: 'mobile', render: (e) => e.mobile || '-' },
    { header: 'Email', accessor: 'email', render: (e) => e.email || '-' },
    { header: 'Category', accessor: 'enquiryType', render: (e) => e.enquiryType || 'General' },
    { header: 'Message', accessor: 'message', render: (e) => e.message || '-' },
    { header: 'Status', accessor: 'status', render: (e) => <Badge status={e.status || 'NEW'}>{e.status || 'NEW'}</Badge> },
    { 
      header: 'Actions', 
      accessor: 'actions', 
      render: (e) => (
        <div className="flex gap-2">
          <button onClick={() => handleEdit(e)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#3b82f6' }} title="Edit">
            <Edit2 size={16} />
          </button>
          <button onClick={() => handleDelete(e._id || e.id)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#ef4444' }} title="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      ) 
    }
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="page-title">Enquiries</h1>
        <p className="page-subtitle">Log and resolve front-desk queries</p>
      </div>

      <div className="grid grid-cols-3 gap-6 md:grid-cols-1">
        <Card className="span-1">
          <div className="flex justify-between items-center mb-4">
            <h3 className="section-title" style={{ margin: 0 }}>
              {editingId ? 'Edit Enquiry' : 'Log New Enquiry'}
            </h3>
            {editingId && (
              <button 
                type="button" 
                onClick={() => {
                  setEditingId(null);
                  setFormData({ name: '', mobile: '', email: '', enquiryType: '', message: '', assignedTo: '', followUpDate: '', remarks: '' });
                }}
                style={{ fontSize: '12px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Cancel Edit
              </button>
            )}
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
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
            <div style={{ marginTop: '8px' }}>
              <Button type="submit" loading={submitting} icon={Send}>
                {editingId ? 'Update Enquiry' : 'Submit Enquiry'}
              </Button>
            </div>
          </form>
        </Card>

        <Card className="span-2">
          <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
            <h3 className="section-title" style={{ margin: 0 }}>Pending & Resolved Enquiries</h3>
            <Badge status="default">{enquiries.length} Total</Badge>
          </div>
          <Table columns={columns} data={enquiries} loading={loading} emptyMessage="No enquiries logged." />
        </Card>
      </div>
    </div>
  );
}
