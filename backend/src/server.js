
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { apiLimiter, catalogLimiter } = require('./middlewares/rateLimit.middleware');
const securityConfig = require('./config/security');
const authRoutes = require('./routes/auth.routes');
const cpuRoutes = require('./routes/cpu.routes');
const gpuRoutes = require('./routes/gpu.routes');
const ramRoutes = require('./routes/ram.routes');
const motherboardRoutes = require('./routes/motherboard.routes');
const psuRoutes = require('./routes/psu.routes');
const caseRoutes = require('./routes/case.routes');
const storageRoutes = require('./routes/storage.routes');
const coolerRoutes = require('./routes/cooler.routes');
const adminRoutes = require('./routes/admin.routes');

//  Inicialización de la app y base de datos
const app = express();
const prisma = new PrismaClient();

// Middlewares globales
app.use(cors(securityConfig.cors));
app.use(cookieParser());
app.use(helmet(securityConfig.helmet));
app.use(express.json());


// Servir archivos estáticos de imágenes ANTES del rate limiter global
app.use('/images', cors(securityConfig.cors), express.static(path.join(__dirname, '../public/images'), {
    setHeaders: (res, path) => {
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
    }
}));


// Rate limiter inteligente: catálogos públicos con límite laxo, el resto con apiLimiter
app.use((req, res, next) => {
  if (req.path.startsWith('/images')) {
    return next(); // No aplicar rate limit a imágenes
  }
  // Catálogos públicos: CPUs, GPUs, RAM, Motherboards, PSUs, Cases, Storages, Coolers
  if (
    req.path.startsWith('/api/cpus') ||
    req.path.startsWith('/api/gpus') ||
    req.path.startsWith('/api/rams') ||
    req.path.startsWith('/api/motherboards') ||
    req.path.startsWith('/api/psus') ||
    req.path.startsWith('/api/cases') ||
    req.path.startsWith('/api/storages') ||
    req.path.startsWith('/api/coolers')
  ) {
    return catalogLimiter(req, res, next);
  }
  // Resto de rutas protegidas
  return apiLimiter(req, res, next);
});

// Rutas principales
const buildRoutes = require('./routes/build.routes'); // Solo validación técnica
const userBuildRoutes = require('./routes/userBuild.routes'); // CRUD de builds de usuario
app.use('/api/auth', authRoutes);
app.use('/api/cpus', cpuRoutes);
app.use('/api/gpus', gpuRoutes);
app.use('/api/rams', ramRoutes);
app.use('/api/motherboards', motherboardRoutes);
app.use('/api/psus', psuRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/storages', storageRoutes);
app.use('/api/coolers', coolerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/build', buildRoutes); // Validación técnica (ej: /api/build/validate)
app.use('/api/user-builds', userBuildRoutes); // CRUD de builds de usuario

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Inicio del servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`PCForge está corriendo en: ${PORT}`);
});


