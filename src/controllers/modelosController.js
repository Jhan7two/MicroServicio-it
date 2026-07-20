const prisma = require('../config/prisma');

const ObtenerTodos = async (req, res, next) => {
  try {
    const modelos = await prisma.modelo.findMany();
    res.json(modelos);
  } catch (error) {
    next(error);
  }
};

const ObtenerPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const modelo = await prisma.modelo.findUnique({ where: { id_modelo: BigInt(id) } });
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
    });
    res.json(modelo);
  } catch (error) {
    next(error);
  }
};

const remover = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.modelo.delete({ where: { id_modelo: BigInt(id) } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { ObtenerTodos, ObtenerPorId, Crear, Actualizar, remover };