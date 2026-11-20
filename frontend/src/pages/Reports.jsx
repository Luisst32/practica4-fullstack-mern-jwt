import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { BarChart2, Download, Package, DollarSign, AlertTriangle, Layers, Calendar } from 'lucide-react';

const Reports = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await api.get('/reporteria/resumen');
        if (res.data.success) {
          setMetrics(res.data.data);
        }
      } catch (err) {
        console.error('Error al cargar reporte:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const handleExportJSON = async () => {
    setExporting(true);
    try {
      const res = await api.get('/reporteria/exportar');
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_transaccional_unemi_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error al exportar reporte');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <p style={{ color: '#64748b' }}>Generando consolidado de reportería y métricas...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>Reportería Transaccional</h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Consolidado analítico de inventario, valuación y operaciones de almacén
          </p>
        </div>

        <button onClick={handleExportJSON} disabled={exporting} className="btn btn-primary">
          <Download size={16} />
          {exporting ? 'Generando descarga...' : 'Exportar Auditoría (JSON)'}
        </button>
      </div>

      {/* Tarjetas de métricas principales */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.9rem', borderRadius: '0.75rem', backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
            <Package size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Total Productos</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0f172a' }}>{metrics?.totalProducts || 0}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.9rem', borderRadius: '0.75rem', backgroundColor: '#ecfdf5', color: '#059669' }}>
            <DollarSign size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Valuación de Inventario</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0f172a' }}>
              ${metrics?.totalInventoryValue?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.9rem', borderRadius: '0.75rem', backgroundColor: '#fffbeb', color: '#d97706' }}>
            <AlertTriangle size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Stock Crítico (≤ 5)</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#d97706' }}>{metrics?.lowStockCount || 0}</div>
          </div>
        </div>
      </div>

      {/* Desglose por categorías */}
      <div className="card">
        <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1.25rem', color: '#1e293b' }}>
          Distribución y Valuación por Categoría
        </h3>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Categoría</th>
                <th>Cantidad de Ítems</th>
                <th>Stock Total</th>
                <th>Precio Promedio</th>
                <th>Valor Consolidado</th>
              </tr>
            </thead>
            <tbody>
              {metrics?.categories?.map((cat) => (
                <tr key={cat._id}>
                  <td style={{ fontWeight: 600, color: '#1e293b' }}>{cat._id}</td>
                  <td>{cat.count} modelos</td>
                  <td>{cat.totalStock} unid.</td>
                  <td>${cat.avgPrice.toFixed(2)}</td>
                  <td style={{ fontWeight: 700, color: '#059669' }}>
                    ${cat.totalValue.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
