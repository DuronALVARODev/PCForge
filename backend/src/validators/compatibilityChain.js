// Cadena de responsabilidad para validación de compatibilidad
const socketValidator = require('./socketValidator');
const ramSpeedValidator = require('./ramSpeedValidator');
const psuPowerValidator = require('./psuPowerValidator');

const validators = [socketValidator, ramSpeedValidator, psuPowerValidator];

function runChain(build) {
  const issues = [];
  let idx = 0;
  function next() {
    if (idx < validators.length) {
      const validator = validators[idx++];
      validator(build, issues, next);
    }
  }
  next();
  return issues;
}

module.exports = { runChain };
