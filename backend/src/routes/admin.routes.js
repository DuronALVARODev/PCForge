const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/requireRole.middleware');

/**
 * Ruta para cambiar el rol de un usuario (solo superadmin)
 */
router.post('/change-role', authMiddleware, requireRole(['superadmin']), async (req, res) => {
  const { userId, newRole } = req.body;
  if (!userId || !newRole) {
    return res.status(400).json({ message: 'Faltan parámetros userId o newRole' });
  }
  if (!['user', 'admin', 'superadmin'].includes(newRole)) {
    return res.status(400).json({ message: 'Rol no permitido' });
  }
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });
    return res.json({ message: `Rol actualizado a ${newRole} para el usuario ${user.email}` });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar el rol', error: error.message });
  }
});

module.exports = router;
