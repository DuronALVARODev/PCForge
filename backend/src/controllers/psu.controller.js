const psuService = require('../services/psu.service');

/**
 * Controlador para obtener todas las PSUs
 * @route GET /api/psus
 */
const getAllPSUs = async (req, res) => {
  try {
    const psus = await psuService.getAllPSUs();
    return res.json(psus);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener PSUs', details: error.message });
  }
};

module.exports = { getAllPSUs };
