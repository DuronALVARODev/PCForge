const motherboardService = require('../services/motherboard.service');

/**
 * Controlador para obtener todas las Motherboards
 * @route GET /api/motherboards
 */
const getAllMotherboards = async (req, res) => {
  try {
    const motherboards = await motherboardService.getAllMotherboards();
    return res.json(motherboards);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener Motherboards', details: error.message });
  }
};

module.exports = { getAllMotherboards };
