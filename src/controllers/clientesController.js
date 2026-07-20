const prisma = require('../config/prisma');

const myselect = {
  id_cliente: true,
  nombre: true,
  apellido: true,
  nit_ci: true,
  telefono: true,
  correo: true,
  direccion: true,
  estado: true,
};

const ObtenerTodos = async (req, res, next) => {
  try {
    const clientes = await prisma.cliente.findMany({
      select: myselect,
    });
    res.json(clientes);
  } catch (error) {
    next(error);
  }
};

const ObtenerPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cliente = await prisma.cliente.findUnique({
      where: { id_cliente: BigInt(id) },
      select: myselect,
    });
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(cliente);
  } catch (error) {
    next(error);
  }
};

const Crear = async (req, res, next) => {
  try {
    const { nombre, apellido, nit_ci, telefono, correo, direccion, estado } = req.body;
    const cliente = await prisma.cliente.create({
      data: { nombre, apellido, nit_ci, telefono, correo, direccion, estado },
      select: myselect,
    });
    res.status(201).json(cliente);
  } catch (error) {
    next(error);
  }
};

const Actualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, nit_ci, telefono, correo, direccion, estado } = req.body;
    const cliente = await prisma.cliente.update({
      where: { id_cliente: BigInt(id) },
      data: { nombre, apellido, nit_ci, telefono, correo, direccion, estado },
      select: myselect,
    });
    res.json(cliente);
  } catch (error) {
    next(error);
  }
};

const remover = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.cliente.delete({ where: { id_cliente: BigInt(id) } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { ObtenerTodos, ObtenerPorId, Crear, Actualizar, remover };