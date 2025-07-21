const rateLimit = require('express-rate-limit');
const securityConfig = require('../config/security');

// Rate limiter para login
const loginLimiter = rateLimit({
  windowMs: securityConfig.rateLimit.login.windowMs,
  max: securityConfig.rateLimit.login.max,
  message: { message: securityConfig.rateLimit.login.message },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: securityConfig.rateLimit.login.skipSuccessfulRequests,
  keyGenerator: (req) => req.ip + ':' + (req.headers['user-agent'] || 'unknown'),
});

// Rate limiter para registro
const registerLimiter = rateLimit({
  windowMs: securityConfig.rateLimit.register.windowMs,
  max: securityConfig.rateLimit.register.max,
  message: { message: securityConfig.rateLimit.register.message },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: securityConfig.rateLimit.register.skipSuccessfulRequests,
});

// Rate limiter general para API
const apiLimiter = rateLimit({
  windowMs: securityConfig.rateLimit.api.windowMs,
  max: securityConfig.rateLimit.api.max,
  message: { message: securityConfig.rateLimit.api.message },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter para verificación de email
const emailVerificationLimiter = rateLimit({
  windowMs: securityConfig.rateLimit.emailVerification.windowMs,
  max: securityConfig.rateLimit.emailVerification.max,
  message: { message: securityConfig.rateLimit.emailVerification.message },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  loginLimiter,
  registerLimiter,
  apiLimiter,
  emailVerificationLimiter,
};