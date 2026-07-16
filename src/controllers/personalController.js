const prisma = require('../config/prisma');

const getAll = async (req, res, next) => {
  try {
    const personal = await prisma.personal.findMany();
    res.json(personal);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const trabajador = await prisma.personal.findUnique({ where: { id_personal: BigInt(id) } });
    if (!trabajador) return res.status(404).json({ error: 'Personal no encontrado' });
    res.json(trabajador);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { nombre, apellido, cargo, telefono, correo, estado } = req.body;
    const trabajador = await prisma.personal.create({
      data: { nombre, apellido, cargo, telefono, correo, estado },
    });
    res.status(201).json(trabajador);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, cargo, telefono, correo, estado } = req.body;
    const trabajador = await prisma.personal.update({
      where: { id_personal: BigInt(id) },
      data: { nombre, apellido, cargo, telefono, correo, estado },
    });
    res.json(trabajador);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.personal.delete({ where: { id_personal: BigInt(id) } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove };