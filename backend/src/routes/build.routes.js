// Ruta para validar compatibilidad de build
const express = require('express');
const router = express.Router();
const buildController = require('../controllers/build.controller');

router.post('/validate', buildController.validateBuild);

module.exports = router;
