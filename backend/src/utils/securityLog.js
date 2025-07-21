/**
 * Logging centralizado de eventos de seguridad
 * @param {string} event - Tipo de evento
 * @param {string|null} userId - ID de usuario
 * @param {string} ip - IP del cliente
 * @param {object} details - Detalles adicionales
 */
const logSecurityEvent = (event, userId, ip, details = {}) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    userId: userId || 'anonymous',
    ip,
    userAgent: details.userAgent || 'unknown',
    ...details,
  };
  console.log('SECURITY_EVENT:', JSON.stringify(logEntry));
  // En producción, enviar a un servicio de logging
};

module.exports = { logSecurityEvent };