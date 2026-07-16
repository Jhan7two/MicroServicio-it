const prisma = require('../config/prisma');

const getAll = async (req, res, next) => {
  try {
    const diagnosticos = await prisma.diagnostico.findMany();
    res.json(diagnosticos);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const diagnostico = await prisma.diagnostico.findUnique({ where: { id_diagnostico: BigInt(id) } });
    if (!diagnostico) return res.status(404).json({ error: 'Diagnóstico no encontrado' });
    res.json(diagnostico);
  } catch (error) {
    next(error);
  }
};

const getByOrdenId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const diagnosticos = await prisma.diagnostico.findMany({ where: { id_orden: BigInt(id) } });
    res.json(diagnosticos);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { id_orden, id_equipo, descripcion, solucion, fecha, observacion, estado } = req.body;
    const diagnostico = await prisma.diagnostico.create({
      data: {
        id_orden: BigInt(id_orden),
        id_equipo: BigInt(id_equipo),
        descripcion,
        solucion,
        fecha: fecha ? new Date(fecha) : undefined,
        observacion,
        estado,
      },
    });
    res.status(201).json(diagnostico);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_orden, id_equipo, descripcion, solucion, fecha, observacion, estado } = req.body;
    const diagnostico = await prisma.diagnostico.update({
      where: { id_diagnostico: BigInt(id) },
      data: {
        id_orden: id_orden ? BigInt(id_orden) : undefined,
        id_equipo: id_equipo ? BigInt(id_equipo) : undefined,
        descripcion,
        solucion,
        fecha: fecha ? new Date(fecha) : undefined,
        observacion,
        estado,
      },
    });
    res.json(diagnostico);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.diagnostico.delete({ where: { id_diagnostico: BigInt(id) } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, getByOrdenId, create, update, remove };