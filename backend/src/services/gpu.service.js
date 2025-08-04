const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Servicio para obtener todas las GPUs
 * @returns {Promise<Array>} Lista de GPUs
 */
const getAllGPUs = async () => {
  return prisma.gPU.findMany();
};

module.exports = { getAllGPUs };
