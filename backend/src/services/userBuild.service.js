const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper: check if all referenced components exist (if provided)
async function validateComponentReferences(data) {
  const checks = [];
  if (data.cpuId) checks.push(prisma.CPU.findUnique({ where: { id: data.cpuId } }));
  if (data.gpuId) checks.push(prisma.GPU.findUnique({ where: { id: data.gpuId } }));
  if (data.ramId) checks.push(prisma.RAM.findUnique({ where: { id: data.ramId } }));
  if (data.motherboardId) checks.push(prisma.Motherboard.findUnique({ where: { id: data.motherboardId } }));
  if (data.psuId) checks.push(prisma.PSU.findUnique({ where: { id: data.psuId } }));
  if (data.caseId) checks.push(prisma.PCCase.findUnique({ where: { id: data.caseId } }));
  if (data.storageId) checks.push(prisma.Storage.findUnique({ where: { id: data.storageId } }));
  if (data.coolerId) checks.push(prisma.CPUCooler.findUnique({ where: { id: data.coolerId } }));
  const results = await Promise.all(checks);
  return results.every(r => r !== null);
}

exports.createBuild = async (userId, data) => {
  if (!(await validateComponentReferences(data))) {
    throw new Error('Uno o más componentes referenciados no existen');
  }
  return prisma.build.create({
    data: {
      name: data.name,
      description: data.description,
      userId,
      cpuId: data.cpuId,
      gpuId: data.gpuId,
      ramId: data.ramId,
      motherboardId: data.motherboardId,
      psuId: data.psuId,
      caseId: data.caseId,
      storageId: data.storageId,
      coolerId: data.coolerId,
      extra: data.extra || {},
    },
  });
};

exports.getBuilds = async (userId) => {
  return prisma.build.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      cpu: true,
      gpu: true,
      ram: true,
      motherboard: true,
      psu: true,
      case: true,
      storage: true,
      cooler: true,
    },
  });
};

exports.getBuildById = async (userId, buildId) => {
  return prisma.build.findFirst({
    where: { id: buildId, userId },
    include: {
      cpu: true,
      gpu: true,
      ram: true,
      motherboard: true,
      psu: true,
      case: true,
      storage: true,
      cooler: true,
    },
  });
};

exports.updateBuild = async (userId, buildId, data) => {
  if (!(await validateComponentReferences(data))) {
    throw new Error('Uno o más componentes referenciados no existen');
  }
  return prisma.build.update({
    where: { id: buildId, userId },
    data: {
      name: data.name,
      description: data.description,
      cpuId: data.cpuId,
      gpuId: data.gpuId,
      ramId: data.ramId,
      motherboardId: data.motherboardId,
      psuId: data.psuId,
      caseId: data.caseId,
      storageId: data.storageId,
      coolerId: data.coolerId,
      extra: data.extra || {},
    },
  }).catch(() => null);
};

exports.deleteBuild = async (userId, buildId) => {
  return prisma.build.delete({
    where: { id: buildId, userId },
  }).catch(() => null);
};
