const Product = require('../models/Product');
const Transaction = require('../models/Transaction');

// @desc    Listar todos los productos con filtros y búsqueda
// @route   GET /api/productos
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice } = req.query;
    const filter = {};

    if (category && category !== 'Todos') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } }
      ];
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al listar productos',
      error: error.message
    });
  }
};

// @desc    Consultar producto por ID
// @route   GET /api/productos/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Identificador no válido o error de búsqueda',
      error: error.message
    });
  }
};

// @desc    Crear nuevo producto (Transaccional)
// @route   POST /api/productos
// @access  Private (Admin)
const createProduct = async (req, res) => {
  try {
    const { name, description, category, price, stock, sku } = req.body;

    if (!name || !description || !category || price === undefined || stock === undefined || !sku) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son obligatorios (nombre, descripción, categoría, precio, stock, sku)'
      });
    }

    if (Number(price) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El precio debe ser un valor positivo mayor a 0'
      });
    }

    // Verificar SKU duplicado
    const existingSku = await Product.findOne({ sku: sku.toUpperCase() });
    if (existingSku) {
      return res.status(400).json({
        success: false,
        message: `El código SKU '${sku.toUpperCase()}' ya existe en el inventario`
      });
    }

    const product = await Product.create({
      name,
      description,
      category,
      price: Number(price),
      stock: Number(stock),
      sku: sku.toUpperCase(),
      createdBy: req.user._id
    });

    // Registrar evento transaccional de registro inicial
    await Transaction.create({
      type: 'COMPRA',
      product: product._id,
      productName: product.name,
      quantity: product.stock,
      unitPrice: product.price,
      totalAmount: product.stock * product.price,
      user: req.user._id,
      userEmail: req.user.email,
      notes: 'Registro inicial de stock en catálogo'
    });

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente y transacción registrada',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al registrar producto',
      error: error.message
    });
  }
};

// @desc    Actualizar producto existente
// @route   PUT /api/productos/:id
// @access  Private (Admin)
const updateProduct = async (req, res) => {
  try {
    const { name, description, category, price, stock, sku } = req.body;

    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado para actualizar'
      });
    }

    const oldStock = product.stock;

    if (name) product.name = name;
    if (description) product.description = description;
    if (category) product.category = category;
    if (price !== undefined) {
      if (Number(price) <= 0) {
        return res.status(400).json({ success: false, message: 'El precio debe ser mayor a 0' });
      }
      product.price = Number(price);
    }
    if (stock !== undefined) {
      product.stock = Number(stock);
    }
    if (sku) {
      const existingSku = await Product.findOne({ sku: sku.toUpperCase(), _id: { $ne: product._id } });
      if (existingSku) {
        return res.status(400).json({ success: false, message: 'El código SKU ya pertenece a otro producto' });
      }
      product.sku = sku.toUpperCase();
    }

    await product.save();

    // Si el stock varió, registrar la transacción de ajuste
    if (stock !== undefined && Number(stock) !== oldStock) {
      const diff = Number(stock) - oldStock;
      await Transaction.create({
        type: diff > 0 ? 'COMPRA' : 'VENTA',
        product: product._id,
        productName: product.name,
        quantity: Math.abs(diff),
        unitPrice: product.price,
        totalAmount: Math.abs(diff) * product.price,
        user: req.user._id,
        userEmail: req.user.email,
        notes: `Ajuste transaccional de inventario (${diff > 0 ? '+' : ''}${diff} unidades)`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar producto',
      error: error.message
    });
  }
};

// @desc    Eliminar producto
// @route   DELETE /api/productos/:id
// @access  Private (Admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado para eliminar'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    // Registro transaccional de baja
    await Transaction.create({
      type: 'AJUSTE',
      product: product._id,
      productName: product.name,
      quantity: product.stock,
      unitPrice: product.price,
      totalAmount: 0,
      user: req.user._id,
      userEmail: req.user.email,
      notes: 'Baja total y retiro de producto del catálogo'
    });

    res.status(200).json({
      success: true,
      message: 'Producto eliminado exitosamente del catálogo'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar producto',
      error: error.message
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
