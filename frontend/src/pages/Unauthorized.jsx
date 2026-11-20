import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldX, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div style={{ maxWidth: 500, margin: '4rem auto', textAlign: 'center' }}>
      <div className="card" style={{ padding: '3rem 2rem' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <ShieldX size={36} color="#ef4444" />
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>
          403 - Acceso Restringido
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
          No tienes los permisos de Administrador requeridos para realizar esta operación o visualizar este recurso. Tu rol actual es <strong>Estudiante / Usuario</strong>.
        </p>
        <Link to="/" className="btn btn-primary" style={{ justifyContent: 'center' }}>
          <ArrowLeft size={16} />
          Volver al Catálogo
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
