const express = require('express');
const router = express.Router();
const { getAllCoolers } = require('../controllers/cooler.controller');

// Ruta para obtener todos los Coolers
router.get('/', getAllCoolers);

module.exports = router;
