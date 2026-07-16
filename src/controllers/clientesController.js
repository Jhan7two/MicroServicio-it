const prisma = require('../config/prisma');

const getAll = async (req, res, next) => {
  try {
    const clientes = await prisma.cliente.findMany();
    res.json(clientes);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cliente = await prisma.cliente.findUnique({ where: { id_cliente: BigInt(id) } });
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(cliente);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { nombre, apellido, nit_ci, telefono, correo, direccion, estado } = req.body;
    const cliente = await prisma.cliente.create({
      data: { nombre, apellido, nit_ci, telefono, correo, direccion, estado },
    });
    res.status(201).json(cliente);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, nit_ci, telefono, correo, direccion, estado } = req.body;
    const cliente = await prisma.cliente.update({
      where: { id_cliente: BigInt(id) },
      data: { nombre, apellido, nit_ci, telefono, correo, direccion, estado },
    });
    res.json(cliente);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.cliente.delete({ where: { id_cliente: BigInt(id) } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove };