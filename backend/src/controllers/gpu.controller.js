const gpuService = require('../services/gpu.service');

/**
 * Controlador para obtener todas las GPUs
 * @route GET /api/gpus
 */
const getAllGPUs = async (req, res) => {
  try {
    const gpus = await gpuService.getAllGPUs();
    return res.json(gpus);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener GPUs', details: error.message });
  }
};

module.exports = { getAllGPUs };
