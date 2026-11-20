import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProductModal from '../components/ProductModal';
import { Plus, Search, Edit3, Trash2, ShieldAlert, Package, RefreshCw, CheckCircle2 } from 'lucide-react';

const CATEGORIES = ['Todos', 'Electrónica', 'Accesorios', 'Software', 'Oficina', 'Servicios'];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const { isAuthenticated, isAdmin, user } = useAuth();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category !== 'Todos') params.category = category;
      if (search) params.search = search;

      const res = await api.get('/productos', { params });
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error('Error al cargar productos:', err);
      showFeedback('error', 'No se pudieron cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
  };

  const handleOpenCreateModal = () => {
    if (!isAdmin) {
      showFeedback('error', 'Solo el Administrador tiene permisos para crear productos (403)');
      return;
    }
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    if (!isAdmin) {
      showFeedback('error', 'Solo el Administrador tiene permisos para editar productos (403)');
      return;
    }
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleSaveProduct = async (productData) => {
    if (editingProduct) {
      const res = await api.put(`/productos/${editingProduct._id}`, productData);
      showFeedback('success', 'Producto actualizado correctamente');
    } else {
      const res = await api.post('/productos', productData);
      showFeedback('success', 'Producto creado exitosamente');
    }
    fetchProducts();
  };

  const handleDeleteProduct = async (id, name) => {
    if (!isAdmin) {
      showFeedback('error', 'Operación denegada: Se requiere rol de Administrador');
      return;
    }

    if (window.confirm(`¿Está seguro de eliminar el producto "${name}" del catálogo?`)) {
      try {
        await api.delete(`/productos/${id}`);
        showFeedback('success', `Producto "${name}" eliminado exitosamente`);
        fetchProducts();
      } catch (err) {
        showFeedback('error', err.response?.data?.message || 'Error al eliminar el producto');
      }
    }
  };

  return (
    <div className="container">
      {/* Banner de Feedback */}
      {feedback.message && (
        <div
          style={{
            backgroundColor: feedback.type === 'success' ? '#ecfdf5' : '#fef2f2',
            border: `1px solid ${feedback.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
            color: feedback.type === 'success' ? '#065f46' : '#991b1b',
            borderRadius: '0.5rem',
            padding: '0.85rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}
        >
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <ShieldAlert size={18} />}
          <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{feedback.message}</span>
        </div>
      )}

      {/* Cabecera */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>Catálogo de Productos</h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Gestión transaccional de inventario con control de acceso RBAC
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={fetchProducts} className="btn btn-secondary">
            <RefreshCw size={16} />
            Actualizar
          </button>
          {isAdmin && (
            <button onClick={handleOpenCreateModal} className="btn btn-primary">
              <Plus size={16} />
              Nuevo Producto
            </button>
          )}
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <form onSubmit={handleSearchSubmit} style={{ flex: 1, minWidth: 260, display: 'flex', gap: '0.5rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                className="input-field"
                placeholder="Buscar por nombre, SKU o descripción..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-secondary">
              <Search size={16} />
              Buscar
            </button>
          </form>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Categoría:</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field"
              style={{ width: 'auto', padding: '0.5rem 0.8rem' }}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de Productos */}
      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            <p>Cargando catálogo desde MongoDB...</p>
          </div>
        ) : products.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            <Package size={36} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
            <p>No se encontraron productos con los criterios especificados.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th style={{ textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#475569' }}>
                        {item.sku}
                      </span>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{item.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', maxWidth: 360, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.description}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>
                        {item.category}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: '#0f172a' }}>
                      ${item.price.toFixed(2)}
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: item.stock <= 5 ? '#fef2f2' : '#ecfdf5',
                          color: item.stock <= 5 ? '#b91c1c' : '#047857'
                        }}
                      >
                        {item.stock} unid.
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {isAdmin ? (
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="btn btn-secondary"
                            style={{ padding: '0.35rem 0.6rem' }}
                            title="Editar producto"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(item._id, item.name)}
                            className="btn btn-danger"
                            style={{ padding: '0.35rem 0.6rem' }}
                            title="Eliminar producto"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>
                          Solo lectura
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
      />
    </div>
  );
};

export default Products;
