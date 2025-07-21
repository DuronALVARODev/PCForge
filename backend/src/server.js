
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { apiLimiter } = require('./middlewares/rateLimit.middleware');
const securityConfig = require('./config/security');
const authRoutes = require('./routes/auth.routes');
const cpuRoutes = require('./routes/cpu.routes');
const adminRoutes = require('./routes/admin.routes');

// Inicialización de la app y base de datos
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

// Rate limiter general para API, pero EXCLUYENDO imágenes
app.use((req, res, next) => {
  if (req.path.startsWith('/images')) {
    return next(); // No aplicar rate limit a imágenes
  }
  return apiLimiter(req, res, next);
});

// Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api/cpus', cpuRoutes);
app.use('/api/admin', adminRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Inicio del servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`PCForge está corriendo en http://localhost:${PORT}`);
});


