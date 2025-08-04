const express = require('express');
const router = express.Router();
const { getAllGPUs } = require('../controllers/gpu.controller');

// Ruta para obtener todas las GPUs
router.get('/', getAllGPUs);

module.exports = router;
