const buildService = require('../services/userBuild.service');
const { validateBuildInput } = require('../utils/validateInput');

// POST /api/user-builds
exports.createBuild = async (req, res) => {
  try {
    const userId = req.user.id;
    const buildData = req.body;
    // Validar input
    const validation = validateBuildInput(buildData);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }
    const build = await buildService.createBuild(userId, buildData);
    res.status(201).json(build);
  } catch (err) {
    console.error('Error en createBuild:', err);
    res.status(500).json({ error: err.message });
  }
};

// GET /api/user-builds
exports.getBuilds = async (req, res) => {
  try {
    const userId = req.user.id;
    const builds = await buildService.getBuilds(userId);
    res.json(builds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/user-builds/:id
exports.getBuildById = async (req, res) => {
  try {
    const userId = req.user.id;
    const buildId = req.params.id;
    const build = await buildService.getBuildById(userId, buildId);
    if (!build) return res.status(404).json({ error: 'Build not found' });
    res.json(build);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/user-builds/:id
exports.updateBuild = async (req, res) => {
  try {
    const userId = req.user.id;
    const buildId = req.params.id;
    const buildData = req.body;
    // Validar input
    const validation = validateBuildInput(buildData);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }
    const updated = await buildService.updateBuild(userId, buildId, buildData);
    if (!updated) return res.status(404).json({ error: 'Build not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/user-builds/:id
exports.deleteBuild = async (req, res) => {
  try {
    const userId = req.user.id;
    const buildId = req.params.id;
    const deleted = await buildService.deleteBuild(userId, buildId);
    if (!deleted) return res.status(404).json({ error: 'Build not found' });
    res.json({ message: 'Build deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
