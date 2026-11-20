const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const seedData = require('./seed');

dotenv.config();

const app = express();

// Middlewares globales
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Rutas de la API
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/productos', require('./routes/product.routes'));
app.use('/api/reporteria', require('./routes/report.routes'));

// Ruta de estado general del servidor (Health Check)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    application: 'API Full Stack JWT - Práctica 4 UNEMI',
    autor: 'Luis Enrique Peñafiel Frías',
    timestamp: new Date().toISOString()
  });
});

// Manejador de rutas 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
});

// Manejador global de errores
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno en el servidor',
    error: err.message
  });
});

const PORT = process.env.PORT || 5000;

// Inicialización de conexión y servidor
const startServer = async () => {
  await connectDB();
  await seedData();

  const server = app.listen(PORT, () => {
    console.log(`🚀 Servidor Backend ejecutándose en http://localhost:${PORT}`);
  });

  return server;
};

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
