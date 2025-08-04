const express = require('express');
const router = express.Router();
const { getAllRAMs } = require('../controllers/ram.controller');

// Ruta para obtener todas las RAMs
router.get('/', getAllRAMs);

module.exports = router;
