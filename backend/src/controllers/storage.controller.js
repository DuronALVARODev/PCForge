const storageService = require('../services/storage.service');

/**
 * Controlador para obtener todos los Storages
 * @route GET /api/storages
 */
const getAllStorages = async (req, res) => {
  try {
    const storages = await storageService.getAllStorages();
    return res.json(storages);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener Storages', details: error.message });
  }
};

module.exports = { getAllStorages };
