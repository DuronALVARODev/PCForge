const coolerService = require('../services/cooler.service');

/**
 * Controlador para obtener todos los Coolers
 * @route GET /api/coolers
 */
const getAllCoolers = async (req, res) => {
  try {
    const coolers = await coolerService.getAllCoolers();
    return res.json(coolers);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener Coolers', details: error.message });
  }
};

module.exports = { getAllCoolers };
