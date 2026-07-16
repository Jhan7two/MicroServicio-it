const prisma = require('../config/prisma');

const getAll = async (req, res, next) => {
  try {
    const equipos = await prisma.equipo.findMany();
    res.json(equipos);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const equipo = await prisma.equipo.findUnique({ where: { id_equipo: BigInt(id) } });
    if (!equipo) return res.status(404).json({ error: 'Equipo no encontrado' });
    res.json(equipo);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { id_marca, id_modelo, numero_serie, color, accesorios, estado } = req.body;
    const equipo = await prisma.equipo.create({
      data: {
        id_marca: BigInt(id_marca),
        id_modelo: BigInt(id_modelo),
        numero_serie,
        color,
        accesorios,
        estado,
      },
    });
    res.status(201).json(equipo);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_marca, id_modelo, numero_serie, color, accesorios, estado } = req.body;
    const equipo = await prisma.equipo.update({
      where: { id_equipo: BigInt(id) },
      data: {
        id_marca: id_marca ? BigInt(id_marca) : undefined,
        id_modelo: id_modelo ? BigInt(id_modelo) : undefined,
        numero_serie,
        color,
        accesorios,
        estado,
      },
    });
    res.json(equipo);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.equipo.delete({ where: { id_equipo: BigInt(id) } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove };