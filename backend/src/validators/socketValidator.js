// Validador de compatibilidad de socket CPU-Motherboard
module.exports = function socketValidator(build, issues, next) {
  if (build.cpu && build.motherboard) {
    const cpuSocket = build.cpu.compatibility?.socket;
    const mbSocket = build.motherboard.compatibility?.socket;
    if (cpuSocket && mbSocket && cpuSocket !== mbSocket) {
      issues.push({
        type: "error",
        message: `Socket incompatible: CPU requiere ${cpuSocket}, Motherboard tiene ${mbSocket}`,
        components: ["cpu", "motherboard"],
      });
    }
  }
  next();
}
