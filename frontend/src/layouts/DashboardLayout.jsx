 import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

export default function DashboardLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('reception_token');
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Visitors', path: '/visitors' },
    { label: 'Appointments', path: '/appointments' },
    { label: 'Enquiries', path: '/enquiries' },
    { label: 'Call Log', path: '/calls' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0f172a' }}>
      {/* Horizontal Navbar Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#1e293b',
          borderBottom: '1px solid #334155',
          padding: '0 24px',
          height: '64px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Brand Title */}
        <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', margin: 0, letterSpacing: '0.5px' }}>
          RECEPTION HQ
        </h2>

        {/* Horizontal Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                color: isActive ? '#ffffff' : '#94a3b8',
                backgroundColor: isActive ? '#2563eb' : 'transparent',
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout Action */}
        <button
          onClick={handleLogout}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            backgroundColor: '#ef4444',
            color: '#ffffff',
            border: 'none',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'background 0.2s ease',
          }}
        >
          Log Out
        </button>
      </header>

      {/* Main Content Workspace */}
      <main style={{ flex: 1, padding: '24px', overflowY: 'auto', backgroundColor: '#f8fafc' }}>
        <Outlet />
      </main>
    </div>
  );
}