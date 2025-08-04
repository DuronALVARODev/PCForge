const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Servicio para obtener todas las RAMs
 * @returns {Promise<Array>} Lista de RAMs
 */
const getAllRAMs = async () => {
  return prisma.rAM.findMany();
};

module.exports = { getAllRAMs };
