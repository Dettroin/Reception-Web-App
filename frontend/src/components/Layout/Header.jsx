import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, User } from 'lucide-react';
import API from '../../services/api';

const Header = () => {
  const location = useLocation();
  const path = location.pathname.split('/').filter(Boolean).pop();
  const pageTitle = path ? path.charAt(0).toUpperCase() + path.slice(1) : 'Dashboard';

  const [user, setUser] = useState({ name: 'User', role: 'Staff' });
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef();

  useEffect(() => {
    // Decode token to get user info
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          name: payload.name || payload.email?.split('@')[0] || 'Receptionist',
          role: payload.role || 'Front Desk',
          email: payload.email || ''
        });
      } catch (e) {
        console.error('Failed to decode token');
      }
    }

    // Fetch active visitors for notifications
    const fetchNotifications = async () => {
      try {
        const res = await API.get('/visitors');
        const activeVisitors = (res.data?.data || []).filter(v => v.status === 'INSIDE');
        setNotifications(activeVisitors);
      } catch (err) {
        console.error('Failed to fetch notifications');
      }
    };
    fetchNotifications();

    // Close notification dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="glass-panel" style={{
      height: 'var(--header-height)',
      borderBottom: '1px solid var(--border)',
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      position: 'sticky',
      top: 0,
      zIndex: 5,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>{pageTitle}</h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ position: 'relative', display: 'none' /* Hide search for now, ready for future */ }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search..." 
            style={{
              padding: '8px 12px 8px 36px',
              borderRadius: '999px',
              border: '1px solid var(--border)',
              background: 'rgba(255, 255, 255, 0.5)',
              fontSize: '13px',
              outline: 'none',
              width: '240px'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div ref={notifRef} style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', position: 'relative', transition: 'transform 0.2s' }} 
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'} 
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Bell size={20} />
              {notifications.length > 0 && (
                <span style={{ position: 'absolute', top: 0, right: 0, width: '8px', height: '8px', backgroundColor: 'var(--secondary)', borderRadius: '50%' }}></span>
              )}
            </button>
            
            {showNotifications && (
              <div className="glass-panel" style={{
                position: 'absolute',
                top: '40px',
                right: 0,
                width: '320px',
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 100,
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}>Notifications</h3>
                {notifications.length === 0 ? (
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center', margin: '20px 0' }}>No new notifications</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {notifications.map(n => (
                      <div key={n._id} style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 'var(--radius-sm)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '13px', fontWeight: '600' }}>{n.name}</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{new Date(n.entryTime || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>is waiting for <b>{n.personToMeet}</b></span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border)' }}></div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '4px 8px', borderRadius: 'var(--radius-lg)', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.02)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                {user.name}
              </p>
              <p style={{ margin: 0, fontSize: '11px', fontWeight: '500', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                {user.role}
              </p>
            </div>
            <div style={{
              width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)', fontSize: '16px', fontWeight: 'bold'
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
