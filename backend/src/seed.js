const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Transaction = require('./models/Transaction');

const seedData = async () => {
  try {
    console.log('🌱 Verificando e inicializando datos de prueba (Seed)...');

    // Verificar si ya existe usuario admin
    const adminExists = await User.findOne({ email: 'admin@unemi.edu.ec' });
    let adminUser = adminExists;

    if (!adminExists) {
      adminUser = await User.create({
        name: 'Administrador UNEMI',
        email: 'admin@unemi.edu.ec',
        password: 'AdminPassword123*',
        role: 'admin'
      });
      console.log('✅ Usuario Administrador creado: admin@unemi.edu.ec');
    }

    // Verificar si ya existe usuario estándar
    const standardExists = await User.findOne({ email: 'estudiante@unemi.edu.ec' });
    let stdUser = standardExists;

    if (!standardExists) {
      stdUser = await User.create({
        name: 'Luis Enrique Estudiante',
        email: 'estudiante@unemi.edu.ec',
        password: 'UserPassword123*',
        role: 'usuario'
      });
      console.log('✅ Usuario Estándar creado: estudiante@unemi.edu.ec');
    }

    // Verificar si existen productos iniciales
    const count = await Product.countDocuments();
    if (count === 0) {
      const initialProducts = [
        {
          name: 'Laptop Gamer ASUS ROG Strix',
          description: 'Intel Core i9, 32GB RAM DDR5, SSD 1TB, RTX 4080',
          category: 'Electrónica',
          price: 1899.99,
          stock: 12,
          sku: 'ASUS-ROG-01',
          createdBy: adminUser._id
        },
        {
          name: 'Monitor Curvo Samsung Odyssey G7 28"',
          description: 'Resolución 4K UHD 144Hz 1ms IPS HDR400',
          category: 'Electrónica',
          price: 649.50,
          stock: 8,
          sku: 'SAM-ODY-G7',
          createdBy: adminUser._id
        },
        {
          name: 'Teclado Mecánico Keychron Q1 Pro',
          description: 'Switches Gateron Red, inalámbrico Bluetooth 5.1 y cable USB-C',
          category: 'Accesorios',
          price: 195.00,
          stock: 25,
          sku: 'KEY-Q1-PRO',
          createdBy: adminUser._id
        },
        {
          name: 'Mouse Inalámbrico Logitech MX Master 3S',
          description: 'Sensor óptico de 8000 DPI con clics silenciosos y rueda electromagnética',
          category: 'Accesorios',
          price: 99.99,
          stock: 30,
          sku: 'LOGI-MX-3S',
          createdBy: adminUser._id
        },
        {
          name: 'Licencia Anual Cloud IDE Pro',
          description: 'Suscripción corporativa para desarrollo web y hosting integrado',
          category: 'Software',
          price: 120.00,
          stock: 100,
          sku: 'LIC-CLOUD-01',
          createdBy: adminUser._id
        },
        {
          name: 'Silla Ergonómica Herman Miller Aeron',
          description: 'Soporte lumbar PostureFit SL ajustable con malla transpirable',
          category: 'Oficina',
          price: 1250.00,
          stock: 4,
          sku: 'CHAIR-HM-AER',
          createdBy: adminUser._id
        }
      ];

      const inserted = await Product.insertMany(initialProducts);
      console.log(`✅ ${inserted.length} productos base insertados en el catálogo.`);

      // Insertar transacciones asociadas a la inicialización
      const transactions = inserted.map((prod) => ({
        type: 'COMPRA',
        product: prod._id,
        productName: prod.name,
        quantity: prod.stock,
        unitPrice: prod.price,
        totalAmount: prod.stock * prod.price,
        user: adminUser._id,
        userEmail: adminUser.email,
        notes: 'Carga inicial de inventario y catálogo'
      }));

      await Transaction.insertMany(transactions);
      console.log('✅ Transacciones iniciales de inventario registradas correctamente.');
    }
  } catch (error) {
    console.error('❌ Error durante la inicialización de datos (seed):', error.message);
  }
};

module.exports = seedData;
