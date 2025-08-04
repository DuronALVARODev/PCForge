const ramService = require('../services/ram.service');

/**
 * Controlador para obtener todas las RAMs
 * @route GET /api/rams
 */
const getAllRAMs = async (req, res) => {
  try {
    const rams = await ramService.getAllRAMs();
    return res.json(rams);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener RAMs', details: error.message });
  }
};

module.exports = { getAllRAMs };
