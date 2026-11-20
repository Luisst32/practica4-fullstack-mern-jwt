import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Products from './pages/Products';
import Reports from './pages/Reports';
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              {/* Rutas Públicas */}
              <Route path="/" element={<Products />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Register />} />
              <Route path="/no-autorizado" element={<Unauthorized />} />

              {/* Rutas Protegidas */}
              <Route
                path="/reportes"
                element={
                  <ProtectedRoute>
                    <Reports />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <footer style={{ borderTop: '1px solid #e2e8f0', padding: '1.5rem', textAlign: 'center', backgroundColor: '#ffffff', color: '#64748b', fontSize: '0.85rem' }}>
            Universidad Estatal de Milagro (UNEMI) - Ingeniería de Software &bull; Desarrollo Web S14 &bull; {new Date().getFullYear()}
          </footer>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
