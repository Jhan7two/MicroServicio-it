const prisma = require('../config/prisma');

// Configuración de campos a seleccionar (sin timestamps)
const selectFields = {
  id_modelo: true,
  nombre_modelo: true,
  estado: true
};

const ObtenerTodos = async (req, res, next) => {
  try {
    const modelos = await prisma.modelo.findMany({
      select: selectFields
    });
    res.json(modelos);
  } catch (error) {
    next(error);
  }
};

const ObtenerPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const modelo = await prisma.modelo.findUnique({ 
      where: { id_modelo: BigInt(id) },
      select: selectFields
    });
    if (!modelo) {
      const error = new Error('Modelo no encontrado');
      error.status = 404;
      return next(error);
    }
    res.json(modelo);
  } catch (error) {
    next(error);
  }
};

const Crear = async (req, res, next) => {
  try {
    const { nombre_modelo, estado } = req.body;
    
    // Verificar si el modelo ya existe
    const modeloExistente = await prisma.modelo.findFirst({
      where: { nombre_modelo }
    });
    
    if (modeloExistente) {
      const error = new Error('Ya existe un modelo con este nombre');
      error.status = 409;
      return next(error);
    }
    
    const modelo = await prisma.modelo.create({
      data: { nombre_modelo, estado },
      select: selectFields
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
    
    // Verificar si el registro existe
    const modeloExistente = await prisma.modelo.findUnique({
      where: { id_modelo: BigInt(id) }
    });
    
    if (!modeloExistente) {
      const error = new Error('El modelo que intentas actualizar no existe');
      error.status = 404;
      return next(error);
    }
    
    // Verificar nombre único si se cambia
    if (nombre_modelo && nombre_modelo !== modeloExistente.nombre_modelo) {
      const nombreExistente = await prisma.modelo.findFirst({
        where: { 
          nombre_modelo,
          id_modelo: { not: BigInt(id) }
        }
      });
      
      if (nombreExistente) {
        const error = new Error('Ya existe otro modelo con este nombre');
        error.status = 409;
        return next(error);
      }
    }
    
    const modelo = await prisma.modelo.update({
      where: { id_modelo: BigInt(id) },
      data: { nombre_modelo, estado },
      select: selectFields
    });
    res.json(modelo);
  } catch (error) {
    next(error);
  }
};

const remover = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const modeloExistente = await prisma.modelo.findUnique({
      where: { id_modelo: BigInt(id) }
    });
    
    if (!modeloExistente) {
      const error = new Error('El modelo que intentas desactivar no existe');
      error.status = 404;
      return next(error);
    }
    
    if (modeloExistente.estado === 0) {
      const error = new Error('El modelo ya está desactivado');
      error.status = 400;
      return next(error);
    }
    
    // Verificar equipos asociados
    const equiposAsociados = await prisma.equipo.count({
      where: { id_modelo: BigInt(id) }
    });
    
    if (equiposAsociados > 0) {
      const error = new Error(`No se puede desactivar el modelo porque tiene ${equiposAsociados} equipo(s) asociado(s)`);
      error.status = 400;
      return next(error);
    }
    
    const modelo = await prisma.modelo.update({
      where: { id_modelo: BigInt(id) },
      data: { estado: 0 },
      select: selectFields
    });
    res.json({ message: 'Modelo desactivado correctamente', modelo });
  } catch (error) {
    next(error);
  }
};

module.exports = { ObtenerTodos, ObtenerPorId, Crear, Actualizar, remover };