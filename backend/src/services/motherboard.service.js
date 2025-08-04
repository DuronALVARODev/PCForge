const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Servicio para obtener todas las Motherboards
 * @returns {Promise<Array>} Lista de Motherboards
 */
const getAllMotherboards = async () => {
  return prisma.motherboard.findMany();
};

module.exports = { getAllMotherboards };
