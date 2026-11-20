const Product = require('../models/Product');
const Transaction = require('../models/Transaction');

// @desc    Obtener métricas y resumen de reportería
// @route   GET /api/reporteria/resumen
// @access  Private
const getSummary = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const lowStockCount = await Product.countDocuments({ stock: { $lte: 5 } });

    // Suma de inventario y desglose por categorías
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalStock: { $sum: '$stock' },
          totalValue: { $sum: { $multiply: ['$price', '$stock'] } },
          avgPrice: { $avg: '$price' }
        }
      },
      { $sort: { totalValue: -1 } }
    ]);

    // Total valorizado global
    const totalValueGlobal = categoryStats.reduce((acc, curr) => acc + curr.totalValue, 0);

    // Conteo de transacciones
    const transactionStats = await Transaction.aggregate([
      {
        $group: {
          _id: '$type',
          totalOperations: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        lowStockCount,
        totalInventoryValue: parseFloat(totalValueGlobal.toFixed(2)),
        categories: categoryStats,
        transactions: transactionStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al generar resumen estadístico',
      error: error.message
    });
  }
};

// @desc    Exportar listado transaccional y detalle para reportes
// @route   GET /api/reporteria/exportar
// @access  Private
const exportReport = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 }).limit(100);
    const products = await Product.find().select('name category price stock sku');

    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      reportName: 'Reporte Transaccional y de Inventario UNEMI',
      author: 'Luis Enrique Peñafiel Frías',
      data: {
        products,
        transactions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al exportar reporte',
      error: error.message
    });
  }
};

module.exports = {
  getSummary,
  exportReport
};
