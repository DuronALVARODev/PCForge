const caseService = require('../services/case.service');

/**
 * Controlador para obtener todos los Cases
 * @route GET /api/cases
 */
const getAllCases = async (req, res) => {
  try {
    const cases = await caseService.getAllCases();
    return res.json(cases);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener Cases', details: error.message });
  }
};

module.exports = { getAllCases };
