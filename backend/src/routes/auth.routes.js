const express = require('express');
const router = express.Router();
const { register, login, getMe, logout, verifyToken, refresh } = require('../controllers/auth.controller');
const { verifyEmail, resendVerificationEmail } = require('../controllers/verify.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { loginLimiter, registerLimiter, emailVerificationLimiter } = require('../middlewares/rateLimit.middleware');
const { body } = require('express-validator');

// Registro de usuario
router.post(
  '/register',
  registerLimiter,
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('username').isLength({ min: 3, max: 30 }).withMessage('El nombre de usuario debe tener entre 3 y 30 caracteres'),
    body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
    body('confirmPassword').exists().withMessage('Debes confirmar la contraseña'),
  ],
  register
);

// Verificación de email
router.get('/verify-email', emailVerificationLimiter, verifyEmail);
router.post('/resend-verification', emailVerificationLimiter, [body('email').isEmail().withMessage('Email inválido')], resendVerificationEmail);

// Login
router.post(
  '/login',
  loginLimiter,
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 8 }).withMessage('Contraseña requerida'),
  ],
  login
);

// Refresh token
router.post('/refresh', refresh);

// Rutas protegidas
router.get('/me', authMiddleware, getMe);
router.post('/logout', authMiddleware, logout);
router.get('/verify', authMiddleware, verifyToken);

module.exports = router;