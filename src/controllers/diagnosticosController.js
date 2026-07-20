const prisma = require('../config/prisma');

const myselect = {
  id_diagnostico: true,
  id_orden: true,
  id_equipo: true,
  descripcion: true,
  solucion: true,
  fecha: true,
  observacion: true,
  estado: true,
};

const ObtenerTodos = async (req, res, next) => {
  try {
    const diagnosticos = await prisma.diagnostico.findMany({
      select: myselect,
    });
    res.json(diagnosticos);
  } catch (error) {
    next(error);
  }
};

const ObtenerPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const diagnostico = await prisma.diagnostico.findUnique({
      select: myselect,
      where: { id_diagnostico: BigInt(id) },
    });
    if (!diagnostico) return res.status(404).json({ error: 'Diagnóstico no encontrado' });
    res.json(diagnostico);
  } catch (error) {
    next(error);
  }
};

const ObtenerPorOrdenId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const diagnosticos = await prisma.diagnostico.findMany({
      select: myselect,
      where: { id_orden: BigInt(id) },
    });
    res.json(diagnosticos);
  } catch (error) {
    next(error);
  }
};

const Crear = async (req, res, next) => {
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
      select: myselect,
    });
    res.status(201).json(diagnostico);
  } catch (error) {
    next(error);
  }
};

const Actualizar = async (req, res, next) => {
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
      select: myselect,
    });
    res.json(diagnostico);
  } catch (error) {
    next(error);
  }
};

const remover = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Soft delete: cambiar estado a 0 (inactivo) en lugar de eliminar
    const diagnostico = await prisma.diagnostico.update({
      where: { id_diagnostico: BigInt(id) },
      data: { estado: 'pendiente' }, // O el estado que indique "eliminado/inactivo"
      select: myselect
    });
    res.json({ message: 'Diagnóstico desactivado correctamente', diagnostico });
  } catch (error) {
    next(error);
  }
};

module.exports = { ObtenerTodos, ObtenerPorId, ObtenerPorOrdenId, Crear, Actualizar, remover };