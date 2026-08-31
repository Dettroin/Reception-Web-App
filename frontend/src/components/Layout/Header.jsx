import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Search, User, Menu, LogOut, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../services/api';

const Header = ({ onMenuClick, activeSection }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Use activeSection if provided, otherwise fallback to path
  const getPageTitle = (section) => {
    switch(section) {
      case 'dashboard': return 'Dashboard';
      case 'visitors': return 'Visitors';
      case 'appointments': return 'Appointments';
      case 'enquiries': return 'Enquiries';
      case 'calls': return 'Call Log';
      default: 
        const path = location.pathname.split('/').filter(Boolean).pop();
        return path ? path.charAt(0).toUpperCase() + path.slice(1) : 'Dashboard';
    }
  };
  
  const pageTitle = getPageTitle(activeSection);

  const [user, setUser] = useState({ name: 'User', role: 'Staff' });
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const notifRef = useRef();
  const profileRef = useRef();
  const latestNotifDate = useRef(0);
  const initialFetchDone = useRef(false);

  useEffect(() => {
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

    const fetchNotifications = async () => {
      try {
        const [visRes, apptRes, enqRes, callRes] = await Promise.all([
          API.get('/visitors').catch(() => ({ data: { data: [] } })),
          API.get('/appointments').catch(() => ({ data: { data: [] } })),
          API.get('/enquiries').catch(() => ({ data: { data: [] } })),
          API.get('/calls').catch(() => ({ data: { data: [] } }))
        ]);

        const visitors = (visRes.data?.data || []).map(item => ({ ...item, _type: 'Visitor', _date: new Date(item.createdAt || item.updatedAt || Date.now()) }));
        const appointments = (apptRes.data?.data || []).map(item => ({ ...item, _type: 'Appointment', _date: new Date(item.createdAt || item.updatedAt || Date.now()) }));
        const enquiries = (enqRes.data?.data || []).map(item => ({ ...item, _type: 'Enquiry', _date: new Date(item.createdAt || item.updatedAt || Date.now()) }));
        const calls = (callRes.data?.data || []).map(item => ({ ...item, _type: 'Call', _date: new Date(item.createdAt || item.updatedAt || Date.now()) }));

        let combined = [...visitors, ...appointments, ...enquiries, ...calls];
        combined.sort((a, b) => b._date - a._date);
        
        if (combined.length > 0) {
          const newest = combined[0];
          if (initialFetchDone.current && newest._date > latestNotifDate.current) {
            // A new entry was added since the last fetch!
            const typeMsg = newest._type === 'Appointment' ? 'Apt' : newest._type;
            const nameMsg = newest.name || newest.visitorName || newest.callerName || 'Someone';
            toast.success(`New ${typeMsg} logged: ${nameMsg}`, {
              icon: '🔔',
              style: { borderRadius: '12px', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', color: '#1e293b' }
            });
          }
          latestNotifDate.current = Math.max(latestNotifDate.current, newest._date);
        }
        
        setNotifications(combined.slice(0, 10));
        initialFetchDone.current = true;
      } catch (err) {
        console.error('Failed to fetch notifications');
      }
    };
    fetchNotifications();

    const intervalId = setInterval(() => fetchNotifications(), 15000);
    const handleUpdate = () => fetchNotifications();
    window.addEventListener('APP_DATA_UPDATED', handleUpdate);

    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      clearInterval(intervalId);
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('APP_DATA_UPDATED', handleUpdate);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('reception_token');
    localStorage.clear();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 w-full h-16 bg-surface/80 backdrop-blur-lg border-b border-border shadow-glass">
      <div className="flex items-center justify-between h-full px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <button 
            className="lg:hidden p-2 -ml-2 text-text-secondary hover:bg-surface-secondary rounded-lg transition-colors"
            onClick={onMenuClick}
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-heading font-bold text-text-primary capitalize">{pageTitle}</h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            
            {/* Notifications */}
            <div ref={notifRef} className="relative">
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="p-2 text-text-secondary hover:text-primary hover:bg-primary-light rounded-full transition-all relative"
              >
                <Bell size={22} />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-status-danger rounded-full border-2 border-white"></span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-card border border-border overflow-hidden z-50 transform origin-top-right transition-all">
                  <div className="p-4 border-b border-border flex justify-between items-center bg-surface-secondary">
                    <h3 className="font-semibold text-text-primary text-sm">Notifications</h3>
                    <span className="text-xs font-medium text-primary bg-primary-light px-2 py-0.5 rounded-full">{notifications.length} New</span>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-text-muted text-sm">
                        No new notifications
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        {notifications.map((n, idx) => (
                          <div key={`${n._type}-${n._id || idx}`} className="p-4 border-b border-border last:border-0 hover:bg-surface-secondary transition-colors cursor-default">
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-sm font-semibold text-text-primary">
                                {n._type === 'Visitor' && (n.name || 'Visitor')}
                                {n._type === 'Appointment' && `Apt: ${n.visitorName || 'Guest'}`}
                                {n._type === 'Enquiry' && `Enq: ${n.name || 'Someone'}`}
                                {n._type === 'Call' && `Call: ${n.callerName || 'Unknown'}`}
                              </span>
                              <span className="text-xs text-text-muted whitespace-nowrap ml-2">
                                {n._date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </span>
                            </div>
                            <span className="text-xs text-text-secondary line-clamp-1">
                              {n._type === 'Visitor' && `Waiting for ${n.personToMeet}`}
                              {n._type === 'Appointment' && `Meeting ${n.meetingWith}`}
                              {n._type === 'Enquiry' && (n.subject || n.purpose || 'New enquiry logged')}
                              {n._type === 'Call' && (n.purpose || 'New call logged')}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="w-px h-6 bg-border hidden sm:block"></div>
            
            {/* User Profile */}
            <div ref={profileRef} className="relative">
              <div 
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-surface-secondary transition-colors cursor-pointer group"
              >
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-text-primary capitalize leading-tight">
                    {user.name}
                  </p>
                  <p className="text-xs font-medium text-text-muted capitalize">
                    {user.role}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-lg border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* User Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-card border border-border overflow-hidden z-50 transform origin-top-right transition-all">
                  <div className="p-3 border-b border-border bg-surface-secondary">
                    <p className="text-sm font-semibold text-text-primary truncate">{user.name}</p>
                    <p className="text-xs text-text-muted truncate">{user.email || 'reception@company.com'}</p>
                  </div>
                  <div className="p-1.5 flex flex-col">
                    <button className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-surface-secondary hover:text-text-primary rounded-lg transition-colors">
                      <User size={16} /> Profile
                    </button>
                    <button className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-surface-secondary hover:text-text-primary rounded-lg transition-colors">
                      <Settings size={16} /> Settings
                    </button>
                    <div className="h-px bg-border my-1"></div>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-status-danger hover:bg-status-dangerBg rounded-lg transition-colors font-medium"
                    >
                      <LogOut size={16} /> Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
