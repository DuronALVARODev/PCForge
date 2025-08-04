const express = require('express');
const router = express.Router();
const userBuildController = require('../controllers/userBuild.controller');
const authMiddleware = require('../middlewares/auth.middleware');
// Todas las rutas requieren autenticación
router.use(authMiddleware);
router.post('/', userBuildController.createBuild);
router.get('/', userBuildController.getBuilds);
router.get('/:id', userBuildController.getBuildById);
router.put('/:id', userBuildController.updateBuild);
router.delete('/:id', userBuildController.deleteBuild);

module.exports = router;
