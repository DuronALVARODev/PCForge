// Validador de potencia de PSU
module.exports = function psuPowerValidator(build, issues, next) {
  if (build.psu) {
    let totalPower = 0;
    if (build.cpu) totalPower += build.cpu.compatibility?.powerRequirement || 0;
    if (build.gpu) totalPower += build.gpu.compatibility?.powerRequirement || 0;
    totalPower += 50; // RAM, storage, fans, etc.
    const psuPower = build.psu.compatibility?.powerRequirement || 0;
    if (totalPower > psuPower * 0.8) {
      issues.push({
        type: "warning",
        message: `PSU podría ser insuficiente. Requerido: ~${totalPower}W, Disponible: ${psuPower}W`,
        components: ["psu"],
      });
    }
  }
  next();
}
