const express = require('express');
const router = express.Router();
const { getAllStorages } = require('../controllers/storage.controller');

// Ruta para obtener todos los Storages
router.get('/', getAllStorages);

module.exports = router;
