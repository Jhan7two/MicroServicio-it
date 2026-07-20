const prisma = require('../config/prisma');

// Configuración de campos a seleccionar (sin timestamps)
const selectFields = {
  id_personal: true,
  nombre: true,
  apellido: true,
  cargo: true,
  telefono: true,
  correo: true,
  estado: true
};

const ObtenerTodos = async (req, res, next) => {
  try {
    const personal = await prisma.personal.findMany({
      select: selectFields
    });
    res.json(personal);
  } catch (error) {
    next(error);
  }
};

const ObtenerPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const trabajador = await prisma.personal.findUnique({ 
      where: { id_personal: BigInt(id) },
      select: selectFields
    });
    if (!trabajador) return res.status(404).json({ error: 'Personal no encontrado' });
    res.json(trabajador);
  } catch (error) {
    next(error);
  }
};

const Crear = async (req, res, next) => {
  try {
    const { nombre, apellido, cargo, telefono, correo, estado } = req.body;
    const trabajador = await prisma.personal.create({
      data: { nombre, apellido, cargo, telefono, correo, estado },
      select: selectFields
    });
    res.status(201).json(trabajador);
  } catch (error) {
    next(error);
  }
};

const Actualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, cargo, telefono, correo, estado } = req.body;
    const trabajador = await prisma.personal.update({
      where: { id_personal: BigInt(id) },
      data: { nombre, apellido, cargo, telefono, correo, estado },
      select: selectFields
    });
    res.json(trabajador);
  } catch (error) {
    next(error);
  }
};

const remover = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.personal.delete({ where: { id_personal: BigInt(id) } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { ObtenerTodos, ObtenerPorId, Crear, Actualizar, remover };