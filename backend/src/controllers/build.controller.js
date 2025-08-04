// Controlador para validar compatibilidad de un build
const { runChain } = require('../validators/compatibilityChain');

// Espera un objeto build en el body con las propiedades cpu, gpu, ram, motherboard, psu, case, storage, cooler
exports.validateBuild = (req, res) => {
  const build = req.body;
  if (!build || typeof build !== 'object') {
    return res.status(400).json({ error: 'Build inválido' });
  }
  const issues = runChain(build);
  res.json({ issues });
};
