// Validador de compatibilidad de velocidad de RAM y Motherboard
module.exports = function ramSpeedValidator(build, issues, next) {
  if (build.ram && build.motherboard) {
    const ramSpeed = build.ram.compatibility?.maxMemorySpeed;
    const mbMaxSpeed = build.motherboard.compatibility?.maxMemorySpeed;
    if (ramSpeed && mbMaxSpeed && ramSpeed > mbMaxSpeed) {
      issues.push({
        type: "warning",
        message: `La RAM funcionará a ${mbMaxSpeed}MHz en lugar de ${ramSpeed}MHz`,
        components: ["ram", "motherboard"],
      });
    }
  }
  next();
}
