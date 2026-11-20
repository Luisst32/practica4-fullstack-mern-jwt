const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generador de Token JWT firmado
const generateToken = (id, role, email) => {
  return jwt.sign(
    { id, role, email },
    process.env.JWT_SECRET || 'jwt_secret_secreta_unemi_2026',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    }
  );
};

// @desc    Registrar nuevo usuario (por defecto rol 'usuario')
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor complete todos los campos requeridos (nombre, email, contraseña)'
      });
    }

    // Verificar si el correo ya existe
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'El correo electrónico ya se encuentra registrado'
      });
    }

    // Por seguridad, el registro público crea siempre rol 'usuario'
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'usuario'
    });

    const token = generateToken(user._id, user.role, user.email);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en el servidor al registrar usuario',
      error: error.message
    });
  }
};

// @desc    Iniciar sesión y generar JWT
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor proporcione correo y contraseña'
      });
    }

    // Buscar usuario incluyendo password explícitamente
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas (correo o contraseña incorrectos)'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas (correo o contraseña incorrectos)'
      });
    }

    const token = generateToken(user._id, user.role, user.email);

    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en el servidor al iniciar sesión',
      error: error.message
    });
  }
};

// @desc    Obtener perfil de usuario autenticado (Ruta protegida)
// @route   GET /api/auth/perfil
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al consultar perfil de usuario',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getProfile
};
