import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarDays, MessageSquare, PhoneCall, LogOut } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('reception_token');
    localStorage.clear();
    navigate('/login', { replace: true });
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Visitors', path: '/visitors', icon: Users },
    { label: 'Appointments', path: '/appointments', icon: CalendarDays },
    { label: 'Enquiries', path: '/enquiries', icon: MessageSquare },
    { label: 'Call Log', path: '/calls', icon: PhoneCall },
  ];

  return (
    <aside className={`
        fixed top-0 left-0 z-40 w-64 h-screen transition-transform duration-300 ease-in-out
        bg-surface backdrop-blur-xl border-r border-border shadow-glass
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}><div className="p-6">
        <h2 className="text-2xl font-heading font-extrabold text-text-primary tracking-tight">
          Reception<span className="text-primary">.HQ</span>
        </h2>
      </div>

      <nav className="flex-1 px-4 flex flex-col gap-1.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsOpen && setIsOpen(false)}
            className={({ isActive }) => `
              group flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200
              ${isActive 
                ? 'bg-primary text-white shadow-md shadow-primary/20' 
                : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} className={isActive ? 'text-white' : 'text-text-muted group-hover:text-text-primary'} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-status-danger font-semibold text-sm transition-all duration-200 hover:bg-status-dangerBg"
        >
          <LogOut size={20} />
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
