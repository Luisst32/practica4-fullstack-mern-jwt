const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    
    if (mongoUri && mongoUri.trim() !== '') {
      await mongoose.connect(mongoUri);
      console.log(`✅ MongoDB conectado exitosamente a: ${mongoose.connection.host}`);
      return;
    }

    // Si no hay URI configurada o si falla, iniciamos MongoDB en memoria automáticamente
    console.log('ℹ️  Iniciando MongoDB en memoria (MongoMemoryServer)...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log(`✅ MongoDB en memoria conectado en: ${uri}`);
  } catch (error) {
    console.warn('⚠️ Intento con URI falló, iniciando MongoDB en memoria de respaldo...', error.message);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log(`✅ MongoDB en memoria conectado exitosamente en: ${uri}`);
    } catch (memErr) {
      console.error('❌ Error crítico al conectar a MongoDB:', memErr.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
