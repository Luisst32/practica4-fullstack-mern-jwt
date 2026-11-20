const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jwt_secret_secreta_unemi_2026');

      // Buscar usuario en base de datos sin incluir contraseña
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no encontrado o token sin validez'
        });
      }

      next();
    } catch (error) {
      console.error('Error al verificar token JWT:', error.message);
      return res.status(401).json({
        success: false,
        message: 'No autorizado: Token inválido o expirado'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado: No se proporcionó ningún token'
    });
  }
};

module.exports = { protect };
