const prisma = require('../config/prisma');

// Configuración de campos a seleccionar (sin timestamps)
const selectFields = {
  id_marca: true,
  nombre_marca: true,
  pais_origen: true,
  estado: true
};

const ObtenerTodos = async (req, res, next) => {
  try {
    const marcas = await prisma.marcaEquipo.findMany({
      select: selectFields
    });
    res.json(marcas);
  } catch (error) {
    next(error);
  }
};

const ObtenerPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const marca = await prisma.marcaEquipo.findUnique({ 
      where: { id_marca: BigInt(id) },
      select: selectFields
    });
    if (!marca) {
      const error = new Error('Marca no encontrada');
      error.status = 404;
      return next(error);
    }
    res.json(marca);
  } catch (error) {
    next(error);
  }
};

const Crear = async (req, res, next) => {
  try {
    const { nombre_marca, pais_origen, estado } = req.body;
    
    // Verificar si el nombre de marca ya existe
    const marcaExistente = await prisma.marcaEquipo.findFirst({
      where: { nombre_marca }
    });
    
    if (marcaExistente) {
      const error = new Error('Ya existe una marca con este nombre');
      error.status = 409;
      return next(error);
    }
    
    const marca = await prisma.marcaEquipo.create({
      data: { nombre_marca, pais_origen, estado },
      select: selectFields
    });
    res.status(201).json(marca);
  } catch (error) {
    next(error);
  }
};

const Actualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre_marca, pais_origen, estado } = req.body;
    
    // Verificar si el registro existe antes de actualizar
    const marcaExistente = await prisma.marcaEquipo.findUnique({
      where: { id_marca: BigInt(id) }
    });
    
    if (!marcaExistente) {
      const error = new Error('La marca que intentas actualizar no existe');
      error.status = 404;
      return next(error);
    }
    
    // Si se cambia el nombre, verificar que no exista en otro registro
    if (nombre_marca && nombre_marca !== marcaExistente.nombre_marca) {
      const nombreExistente = await prisma.marcaEquipo.findFirst({
        where: { 
          nombre_marca,
          id_marca: { not: BigInt(id) }
        }
      });
      
      if (nombreExistente) {
        const error = new Error('Ya existe otra marca con este nombre');
        error.status = 409;
        return next(error);
      }
    }
    
    const marca = await prisma.marcaEquipo.update({
      where: { id_marca: BigInt(id) },
      data: { nombre_marca, pais_origen, estado },
      select: selectFields
    });
    res.json(marca);
  } catch (error) {
    next(error);
  }
};

const remover = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Verificar si el registro existe antes de desactivar
    const marcaExistente = await prisma.marcaEquipo.findUnique({
      where: { id_marca: BigInt(id) }
    });
    
    if (!marcaExistente) {
      const error = new Error('La marca que intentas desactivar no existe');
      error.status = 404;
      return next(error);
    }
    
    if (marcaExistente.estado === 0) {
      const error = new Error('La marca ya está desactivada');
      error.status = 400;
      return next(error);
    }
    
    // Verificar si tiene equipos asociados
    const equiposAsociados = await prisma.equipo.count({
      where: { id_marca: BigInt(id) }
    });
    
    if (equiposAsociados > 0) {
      const error = new Error(`No se puede desactivar la marca porque tiene ${equiposAsociados} equipo(s) asociado(s)`);
      error.status = 400;
      return next(error);
    }
    
    // Soft delete: cambiar estado a 0 (inactivo) en lugar de eliminar
    const marca = await prisma.marcaEquipo.update({
      where: { id_marca: BigInt(id) },
      data: { estado: 0 },
      select: selectFields
    });
    res.json({ message: 'Marca desactivada correctamente', marca });
  } catch (error) {
    next(error);
  }
};

module.exports = { ObtenerTodos, ObtenerPorId, Crear, Actualizar, remover };