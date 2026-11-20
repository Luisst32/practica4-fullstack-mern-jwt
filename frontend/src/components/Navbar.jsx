import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layers, LogOut, LogIn, UserPlus, BarChart2, Package, ShieldCheck, User } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 40 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0.85rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700, fontSize: '1.2rem', color: '#1e3a8a' }}>
          <Layers size={26} color="#1e3a8a" />
          <span>UNEMI FullStack <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 400 }}>MERN + JWT</span></span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#334155', fontWeight: 500, fontSize: '0.95rem' }}>
            <Package size={18} />
            Catálogo
          </Link>

          {isAuthenticated && (
            <Link to="/reportes" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#334155', fontWeight: 500, fontSize: '0.95rem' }}>
              <BarChart2 size={18} />
              Reportería
            </Link>
          )}

          <div style={{ height: 24, width: 1, backgroundColor: '#e2e8f0' }} />

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: isAdmin ? '#fef3c7' : '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isAdmin ? <ShieldCheck size={18} color="#b45309" /> : <User size={18} color="#0284c7" />}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.name}</span>
                  <span className={`badge ${isAdmin ? 'badge-admin' : 'badge-user'}`} style={{ width: 'fit-content' }}>
                    {user?.role}
                  </span>
                </div>
              </div>

              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.45rem 0.8rem' }}>
                <LogOut size={16} />
                Salir
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 0.9rem' }}>
                <LogIn size={16} />
                Ingresar
              </Link>
              <Link to="/registro" className="btn btn-primary" style={{ padding: '0.5rem 0.9rem' }}>
                <UserPlus size={16} />
                Registrarse
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
