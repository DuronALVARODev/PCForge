const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Servicio para obtener todos los CPUs
 * @returns {Promise<Array>} Lista de CPUs
 */
const getAllCPUs = async () => {
  return prisma.cPU.findMany();
};

module.exports = { getAllCPUs };
