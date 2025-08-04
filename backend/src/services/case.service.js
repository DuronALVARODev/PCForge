const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Servicio para obtener todos los Cases
 * @returns {Promise<Array>} Lista de Cases
 */
const getAllCases = async () => {
  return prisma.pCCase.findMany();
};

module.exports = { getAllCases };
