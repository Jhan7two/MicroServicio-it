const prisma = require('../config/prisma');

const getAll = async (req, res, next) => {
  try {
    const marcas = await prisma.marcaEquipo.findMany();
    res.json(marcas);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const marca = await prisma.marcaEquipo.findUnique({ where: { id_marca: BigInt(id) } });
    if (!marca) return res.status(404).json({ error: 'Marca no encontrada' });
    res.json(marca);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { nombre_marca, pais_origen, estado } = req.body;
    const marca = await prisma.marcaEquipo.create({
      data: { nombre_marca, pais_origen, estado },
    });
    res.status(201).json(marca);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre_marca, pais_origen, estado } = req.body;
    const marca = await prisma.marcaEquipo.update({
      where: { id_marca: BigInt(id) },
      data: { nombre_marca, pais_origen, estado },
    });
    res.json(marca);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.marcaEquipo.delete({ where: { id_marca: BigInt(id) } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove };