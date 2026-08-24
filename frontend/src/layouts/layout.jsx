import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: 220, background: '#111827', color: '#fff', padding: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 24 }}>Reception App</div>
        <nav className="flex-col">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/visitors" className="mt-2">Visitors</Link>
          <Link to="/appointments" className="mt-2">Appointments</Link>
          <Link to="/enquiries" className="mt-2">Enquiries</Link>
          <Link to="/calls" className="mt-2">Calls</Link>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: 16 }}>
        <header className="flex" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: 20 }}>Reception Management</h2>
          <button className="btn" onClick={handleLogout}>Logout</button>
        </header>
        <Outlet />
      </main>
    </div>
  );
}