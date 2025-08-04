const express = require('express');
const router = express.Router();
const { getAllMotherboards } = require('../controllers/motherboard.controller');

// Ruta para obtener todas las Motherboards
router.get('/', getAllMotherboards);

module.exports = router;
