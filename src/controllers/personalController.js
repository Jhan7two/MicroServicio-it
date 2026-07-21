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
    if (!trabajador) {
      const error = new Error('Personal no encontrado');
      error.status = 404;
      return next(error);
    }
    res.json(trabajador);
  } catch (error) {
    next(error);
  }
};

const Crear = async (req, res, next) => {
  try {
    const { nombre, apellido, cargo, telefono, correo, estado } = req.body;
    
    // Verificar si el correo ya existe
    const correoExistente = await prisma.personal.findFirst({
      where: { correo }
    });
    
    if (correoExistente) {
      const error = new Error('Ya existe un personal con este correo electrónico');
      error.status = 409;
      return next(error);
    }
    
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
    
    // Verificar si el registro existe antes de actualizar
    const personalExistente = await prisma.personal.findUnique({
      where: { id_personal: BigInt(id) }
    });
    
    if (!personalExistente) {
      const error = new Error('El personal que intentas actualizar no existe');
      error.status = 404;
      return next(error);
    }
    
    // Si se cambia el correo, verificar que no exista en otro registro
    if (correo && correo !== personalExistente.correo) {
      const correoExistente = await prisma.personal.findFirst({
        where: { 
          correo,
          id_personal: { not: BigInt(id) }
        }
      });
      
      if (correoExistente) {
        const error = new Error('Ya existe otro personal con este correo electrónico');
        error.status = 409;
        return next(error);
      }
    }
    
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
    
    // Verificar si el registro existe antes de desactivar
    const personalExistente = await prisma.personal.findUnique({
      where: { id_personal: BigInt(id) }
    });
    
    if (!personalExistente) {
      const error = new Error('El personal que intentas desactivar no existe');
      error.status = 404;
      return next(error);
    }
    
    if (personalExistente.estado === 0) {
      const error = new Error('El personal ya está desactivado');
      error.status = 400;
      return next(error);
    }
    
    // Verificar si tiene órdenes activas
    const ordenesActivas = await prisma.orden.count({
      where: { 
        id_personal: BigInt(id),
        estado: { not: 'Anulado' }
      }
    });
    
    if (ordenesActivas > 0) {
      const error = new Error(`No se puede desactivar el personal porque tiene ${ordenesActivas} orden(es) de servicio activa(s)`);
      error.status = 400;
      return next(error);
    }
    
    // Soft delete: cambiar estado a 0 (inactivo) en lugar de eliminar
    const trabajador = await prisma.personal.update({
      where: { id_personal: BigInt(id) },
      data: { estado: 0 },
      select: selectFields
    });
    res.json({ message: 'Personal desactivado correctamente', trabajador });
  } catch (error) {
    next(error);
  }
};

module.exports = { ObtenerTodos, ObtenerPorId, Crear, Actualizar, remover };

module.exports = { ObtenerTodos, ObtenerPorId, Crear, Actualizar, remover };