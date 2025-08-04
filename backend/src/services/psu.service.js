const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Servicio para obtener todas las PSUs
 * @returns {Promise<Array>} Lista de PSUs
 */
const getAllPSUs = async () => {
  return prisma.pSU.findMany();
};

module.exports = { getAllPSUs };
