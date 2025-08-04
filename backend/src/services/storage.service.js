const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Servicio para obtener todos los Storages
 * @returns {Promise<Array>} Lista de Storages
 */
const getAllStorages = async () => {
  return prisma.storage.findMany();
};

module.exports = { getAllStorages };
