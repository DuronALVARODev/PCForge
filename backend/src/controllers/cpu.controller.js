const cpuService = require('../services/cpu.service');

/**
 * Controlador para obtener todos los CPUs
 * @route GET /api/cpus
 */
const getAllCPUs = async (req, res) => {
  try {
    const cpus = await cpuService.getAllCPUs();
    return res.json(cpus);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener CPUs', details: error.message });
  }
};

module.exports = { getAllCPUs };

