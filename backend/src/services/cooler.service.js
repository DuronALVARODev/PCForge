const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Servicio para obtener todos los Coolers
 * @returns {Promise<Array>} Lista de Coolers
 */
const getAllCoolers = async () => {
  return prisma.cPUCooler.findMany();
};

module.exports = { getAllCoolers };
