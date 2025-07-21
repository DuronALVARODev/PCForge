const validator = require('validator');
const xss = require('xss');

/**
 * Sanitiza la entrada eliminando espacios, escapando caracteres peligrosos y limpiando XSS
 * @param {string} input
 * @returns {string}
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return validator.escape(validator.trim(xss(input)));
};

/**
 * Valida que el email tenga formato correcto
 * @param {string} email
 * @returns {boolean}
 */
const isValidEmail = (email) => validator.isEmail(email);

/**
 * Valida que la contraseña sea fuerte (mínimo 8, mayúscula, minúscula, número, especial)
 * @param {string} password
 * @returns {boolean}
 */
const isStrongPassword = (password) =>
  validator.isStrongPassword(password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  });

/**
 * Valida que el username cumpla las reglas de seguridad
 * @param {string} username
 * @returns {boolean}
 */
const isValidUsername = (username) => {
  if (!username || typeof username !== 'string') return false;
  const sanitizedUsername = sanitizeInput(username);
  if (sanitizedUsername.length < 3 || sanitizedUsername.length > 30) return false;
  if (!/^[a-zA-Z0-9_-]+$/.test(sanitizedUsername)) return false;
  if (sanitizedUsername.startsWith('-') || sanitizedUsername.endsWith('-')) return false;
  if (/[<>"'&]/.test(sanitizedUsername)) return false;
  return true;
};

/**
 * Sanitiza y valida un string con longitud máxima
 * @param {string} input
 * @param {number} maxLength
 * @returns {string|null}
 */
const sanitizeAndValidateString = (input, maxLength = 255) => {
  if (!input || typeof input !== 'string') return null;
  const sanitized = sanitizeInput(input);
  return sanitized.length <= maxLength ? sanitized : null;
};

/**
 * Implementación dummy de rate limit (usar Redis en prod)
 */
const validateRateLimit = (ip, action, limit = 5, windowMs = 15 * 60 * 1000) => true;

/**
 * Valida que el token sea seguro (hexadecimal de 64 caracteres)
 * @param {string} token
 * @returns {boolean}
 */
const isSecureToken = (token) => {
  if (!token || typeof token !== 'string') return false;
  return /^[a-fA-F0-9]{64}$/.test(token);
};

module.exports = {
  isValidEmail,
  isStrongPassword,
  isValidUsername,
  sanitizeInput,
  sanitizeAndValidateString,
  validateRateLimit,
  isSecureToken,
};
