const { PrismaClient } = require('@prisma/client');
const { isSecureToken, sanitizeInput } = require('../utils/validateInput');
const { validationResult } = require('express-validator');
const xss = require('xss');
const { logSecurityEvent } = require('../utils/securityLog');
const prisma = new PrismaClient();

/**
 * Controlador para verificar email
 */
const verifyEmail = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Datos inválidos', errors: errors.array() });
  }
  const token = xss(req.query.token);
  if (!token) return res.status(400).json({ message: 'Token Requerido' });
  const user = await prisma.user.findFirst({ where: { verificationToken: token } });
  if (!user) {
    // Si no hay usuario con ese token, puede que ya esté verificado o el token sea inválido
    const verifiedUser = await prisma.user.findFirst({ where: { verificationToken: null, isVerified: true } });
    if (verifiedUser) { /* ... */ }
    return res.status(400).json({ message: 'Token invalido o expirado' });
  }
  if (user.isVerified) {
    return res.status(200).json({ message: 'La cuenta ya está verificada.' });
  }
  if (user.tokenExpiry < new Date()) {
    return res.status(400).json({ message: 'Token invalido o expirado' });
  }
  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verificationToken: null,
      tokenExpiry: null,
    },
  });
  return res.status(200).json({ message: 'Correo verificado correctamente' });
};

/**
 * Controlador para reenviar email de verificación
 */
const resendVerificationEmail = async (req, res) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'] || 'unknown';
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logSecurityEvent('RESEND_VERIFICATION_VALIDATION_ERROR', null, clientIP, { userAgent, errors: errors.array() });
    return res.status(400).json({ message: 'Datos inválidos', errors: errors.array(), code: 'RESEND_VERIFICATION_VALIDATION_ERROR' });
  }
  try {
    let { email } = req.body;
    email = xss(sanitizeInput(email)).toLowerCase();
    if (!email) {
      logSecurityEvent('RESEND_VERIFICATION_NO_EMAIL', null, clientIP, { userAgent });
      return res.status(400).json({ message: 'Email requerido', code: 'RESEND_VERIFICATION_NO_EMAIL' });
    }
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        isVerified: true,
        verificationToken: true,
        tokenExpiry: true,
      },
    });
    if (!user) {
      logSecurityEvent('RESEND_VERIFICATION_USER_NOT_FOUND', null, clientIP, { userAgent, email });
      return res.status(404).json({ message: 'Usuario no encontrado', code: 'RESEND_VERIFICATION_USER_NOT_FOUND' });
    }
    if (user.isVerified) {
      logSecurityEvent('RESEND_VERIFICATION_ALREADY_VERIFIED', user.id, clientIP, { userAgent, email });
      return res.status(200).json({ message: 'La cuenta ya está verificada', code: 'RESEND_VERIFICATION_ALREADY_VERIFIED' });
    }
    const { generateSecureToken } = require('../services/auth.service');
    const newToken = generateSecureToken();
    const newTokenExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h
    // Actualizar token en la base de datos
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken: newToken,
        tokenExpiry: newTokenExpiry,
        updatedAt: new Date(),
      },
    });
    // Enviar nuevo email de verificación
    const { sendVerificationEmail } = require('../utils/mailer');
    await sendVerificationEmail(user.email, newToken);
    logSecurityEvent('RESEND_VERIFICATION_SUCCESS', user.id, clientIP, { userAgent, email: user.email });
    res.status(200).json({ message: 'Nuevo enlace de verificación enviado', code: 'RESEND_VERIFICATION_SUCCESS' });
  } catch (error) {
    logSecurityEvent('RESEND_VERIFICATION_ERROR', null, clientIP, { userAgent, error: error.message });
    console.error('Error reenviando verificación:', error);
    res.status(500).json({ message: 'Error interno del servidor', code: 'RESEND_VERIFICATION_INTERNAL_ERROR' });
  }
};

module.exports = { verifyEmail, resendVerificationEmail };
