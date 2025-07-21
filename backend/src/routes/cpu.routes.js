const express = require('express');
const router = express.Router();
const { getAllCPUs } = require('../controllers/cpu.controller');

// Ruta para obtener todos los CPUs
router.get('/', getAllCPUs);

module.exports = router;
