const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const xss = require('xss');
const prisma = new PrismaClient();

/**
 * Middleware de autenticación JWT
 */
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  // Obtener el token de la cabecera o de la cookie (prioridad: header, luego cookie)
  let token = null;
  if (req.headers['authorization'] && req.headers['authorization'].startsWith('Bearer ')) {
    token = req.headers['authorization'].slice(7);
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }
  if (!token && req.cookies?.refreshToken) {
    token = req.cookies.refreshToken;
  }
  if (!token) {
    // Si no hay token, intentar refrescar usando refreshToken
    if (req.cookies && req.cookies.refreshToken) {
      req.refreshToken = req.cookies.refreshToken;
      return next();
    }
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    token = xss(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, username: true, createdAt: true, isVerified: true, role: true },
    });
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports = authMiddleware;