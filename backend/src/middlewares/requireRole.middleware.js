/**
 * Middleware para proteger rutas según el rol del usuario
 * @param {Array<string>} roles - Roles permitidos
 */
const requireRole = (roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Acceso denegado: privilegios insuficientes.' });
  }
  next();
};

module.exports = requireRole;
