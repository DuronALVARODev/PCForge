const express = require('express');
const router = express.Router();
const { getAllPSUs } = require('../controllers/psu.controller');

// Ruta para obtener todas las PSUs
router.get('/', getAllPSUs);

module.exports = router;
