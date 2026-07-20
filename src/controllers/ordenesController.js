const prisma = require('../config/prisma');

const ObtenerTodos = async (req, res, next) => {
  try {
    const ordenes = await prisma.orden.findMany();
    res.json(ordenes);
  } catch (error) {
    next(error);
  }
};

const ObtenerPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const orden = await prisma.orden.findUnique({ where: { id_orden: BigInt(id) } });
    if (!orden) return res.status(404).json({ error: 'Orden no encontrada' });
    res.json(orden);
  } catch (error) {
    next(error);
  }
};

const Crear = async (req, res, next) => {
  try {
    const { id_cliente, id_personal, fecha_ingreso, fecha_entrega, problema_reportado, costo, estado } = req.body;
    const orden = await prisma.orden.create({
      data: {
        id_cliente: BigInt(id_cliente),
        id_personal: BigInt(id_personal),
        fecha_ingreso: fecha_ingreso ? new Date(fecha_ingreso) : undefined,
        fecha_entrega: fecha_entrega ? new Date(fecha_entrega) : undefined,
        problema_reportado,
        costo: costo ? Number(costo) : undefined,
        estado,
      },
    });
    res.status(201).json(orden);
  } catch (error) {
    next(error);
  }
};

const Actualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_cliente, id_personal, fecha_ingreso, fecha_entrega, problema_reportado, costo, estado } = req.body;
    const orden = await prisma.orden.update({
      where: { id_orden: BigInt(id) },
      data: {
        id_cliente: id_cliente ? BigInt(id_cliente) : undefined,
        id_personal: id_personal ? BigInt(id_personal) : undefined,
        fecha_ingreso: fecha_ingreso ? new Date(fecha_ingreso) : undefined,
        fecha_entrega: fecha_entrega ? new Date(fecha_entrega) : undefined,
        problema_reportado,
        costo: costo ? Number(costo) : undefined,
        estado,
      },
    });
    res.json(orden);
  } catch (error) {
    next(error);
  }
};

const remover = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.orden.delete({ where: { id_orden: BigInt(id) } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { ObtenerTodos, ObtenerPorId, Crear, Actualizar, remover };