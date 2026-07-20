const prisma = require('../config/prisma');

// Configuración de campos a seleccionar (sin timestamps)
const selectFields = {
  id_modelo: true,
  nombre_modelo: true,
  estado: true
};

const ObtenerTodos = async (req, res, next) => {
  try {
    const modelos = await prisma.modelo.findMany({
      select: selectFields
    });
    res.json(modelos);
  } catch (error) {
    next(error);
  }
};

const ObtenerPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const modelo = await prisma.modelo.findUnique({ 
      where: { id_modelo: BigInt(id) },
      select: selectFields
    });
    if (!modelo) return res.status(404).json({ error: 'Modelo no encontrado' });
    res.json(modelo);
  } catch (error) {
    next(error);
  }
};

const Crear = async (req, res, next) => {
  try {
    const { nombre_modelo, estado } = req.body;
    const modelo = await prisma.modelo.create({
      data: { nombre_modelo, estado },
      select: selectFields
    });
    res.status(201).json(modelo);
  } catch (error) {
    next(error);
  }
};

const Actualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre_modelo, estado } = req.body;
    const modelo = await prisma.modelo.update({
      where: { id_modelo: BigInt(id) },
      data: { nombre_modelo, estado },
      select: selectFields
    });
    res.json(modelo);
  } catch (error) {
    next(error);
  }
};

const remover = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Soft delete: cambiar estado a 0 (inactivo) en lugar de eliminar
    const modelo = await prisma.modelo.update({
      where: { id_modelo: BigInt(id) },
      data: { estado: 0 },
      select: selectFields
    });
    res.json({ message: 'Modelo desactivado correctamente', modelo });
  } catch (error) {
    next(error);
  }
};

module.exports = { ObtenerTodos, ObtenerPorId, Crear, Actualizar, remover };