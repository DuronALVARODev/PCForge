const express = require('express');
const router = express.Router();
const { getAllCases } = require('../controllers/case.controller');

// Ruta para obtener todos los Cases
router.get('/', getAllCases);

module.exports = router;
