const express = require('express');
const router = express.Router();
const { getSummary, exportReport } = require('../controllers/report.controller');
const { protect } = require('../middlewares/auth.middleware');

// Rutas protegidas de reportería
router.get('/resumen', protect, getSummary);
router.get('/exportar', protect, exportReport);

module.exports = router;
