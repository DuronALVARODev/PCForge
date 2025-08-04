const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const xss = require('xss');
const prisma = new PrismaClient();

/**
 * Middleware de autenticación JWT
 */
const authMiddleware = async (req, res, next) => {
  // Buscar token en cookie accessToken, luego en header Authorization, luego en refreshToken
  let token = null;
  if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  } else {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    } else if (req.cookies && req.cookies.refreshToken) {
      token = req.cookies.refreshToken;
    }
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