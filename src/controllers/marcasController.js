const prisma = require('../config/prisma');

// Configuración de campos a seleccionar (sin timestamps)
const selectFields = {
  id_marca: true,
  nombre_marca: true,
  pais_origen: true,
  estado: true
};

const ObtenerTodos = async (req, res, next) => {
  try {
    const marcas = await prisma.marcaEquipo.findMany({
      select: selectFields
    });
    res.json(marcas);
  } catch (error) {
    next(error);
  }
};

const ObtenerPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const marca = await prisma.marcaEquipo.findUnique({ 
      where: { id_marca: BigInt(id) },
      select: selectFields
    });
    if (!marca) return res.status(404).json({ error: 'Marca no encontrada' });
    res.json(marca);
  } catch (error) {
    next(error);
  }
};

const Crear = async (req, res, next) => {
  try {
    const { nombre_marca, pais_origen, estado } = req.body;
    const marca = await prisma.marcaEquipo.create({
      data: { nombre_marca, pais_origen, estado },
      select: selectFields
    });
    res.status(201).json(marca);
  } catch (error) {
    next(error);
  }
};

const Actualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre_marca, pais_origen, estado } = req.body;
    const marca = await prisma.marcaEquipo.update({
      where: { id_marca: BigInt(id) },
      data: { nombre_marca, pais_origen, estado },
      select: selectFields
    });
    res.json(marca);
  } catch (error) {
    next(error);
  }
};

const remover = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Soft delete: cambiar estado a 0 (inactivo) en lugar de eliminar
    const marca = await prisma.marcaEquipo.update({
      where: { id_marca: BigInt(id) },
      data: { estado: 0 },
      select: selectFields
    });
    res.json({ message: 'Marca desactivada correctamente', marca });
  } catch (error) {
    next(error);
  }
};

module.exports = { ObtenerTodos, ObtenerPorId, Crear, Actualizar, remover };