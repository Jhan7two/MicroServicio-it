const prisma = require('../config/prisma');

// Configuración de campos a seleccionar (sin timestamps)
const selectFields = {
  id_equipo: true,
  numero_serie: true,
  color: true,
  accesorios: true,
  estado: true,
  id_marca: true,
  id_modelo: true
};

const ObtenerTodos = async (req, res, next) => {
  try {
    const equipos = await prisma.equipo.findMany({
      select: selectFields
    });
    res.json(equipos);
  } catch (error) {
    next(error);
  }
};

const ObtenerPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const equipo = await prisma.equipo.findUnique({ 
      where: { id_equipo: BigInt(id) },
      select: selectFields
    });
    if (!equipo) {
      const error = new Error('Equipo no encontrado');
      error.status = 404;
      return next(error);
    }
    res.json(equipo);
  } catch (error) {
    next(error);
  }
};

const Crear = async (req, res, next) => {
  try {
    const { id_marca, id_modelo, numero_serie, color, accesorios, estado } = req.body;
    
    // Verificar si el número de serie ya existe
    const serieExistente = await prisma.equipo.findFirst({
      where: { numero_serie }
    });
    
    if (serieExistente) {
      const error = new Error('Ya existe un equipo con este número de serie');
      error.status = 409;
      return next(error);
    }
    
    // Verificar que la marca existe
    const marcaExiste = await prisma.marcaEquipo.findUnique({
      where: { id_marca: BigInt(id_marca) }
    });
    
    if (!marcaExiste) {
      const error = new Error('La marca especificada no existe');
      error.status = 400;
      return next(error);
    }
    
    // Verificar que el modelo existe
    const modeloExiste = await prisma.modelo.findUnique({
      where: { id_modelo: BigInt(id_modelo) }
    });
    
    if (!modeloExiste) {
      const error = new Error('El modelo especificado no existe');
      error.status = 400;
      return next(error);
    }
    
    const equipo = await prisma.equipo.create({
      data: {
        id_marca: BigInt(id_marca),
        id_modelo: BigInt(id_modelo),
        numero_serie,
        color,
        accesorios,
        estado,
      },
      select: selectFields
    });
    res.status(201).json(equipo);
  } catch (error) {
    next(error);
  }
};

const Actualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_marca, id_modelo, numero_serie, color, accesorios, estado } = req.body;
    
    // Verificar si el equipo existe
    const equipoExistente = await prisma.equipo.findUnique({
      where: { id_equipo: BigInt(id) }
    });
    
    if (!equipoExistente) {
      const error = new Error('El equipo que intentas actualizar no existe');
      error.status = 404;
      return next(error);
    }
    
    // Verificar número de serie único si se cambia
    if (numero_serie && numero_serie !== equipoExistente.numero_serie) {
      const serieExistente = await prisma.equipo.findFirst({
        where: { 
          numero_serie,
          id_equipo: { not: BigInt(id) }
        }
      });
      
      if (serieExistente) {
        const error = new Error('Ya existe otro equipo con este número de serie');
        error.status = 409;
        return next(error);
      }
    }
    
    // Verificar relaciones si se cambian
    if (id_marca) {
      const marcaExiste = await prisma.marcaEquipo.findUnique({
        where: { id_marca: BigInt(id_marca) }
      });
      
      if (!marcaExiste) {
        const error = new Error('La marca especificada no existe');
        error.status = 400;
        return next(error);
      }
    }
    
    if (id_modelo) {
      const modeloExiste = await prisma.modelo.findUnique({
        where: { id_modelo: BigInt(id_modelo) }
      });
      
      if (!modeloExiste) {
        const error = new Error('El modelo especificado no existe');
        error.status = 400;
        return next(error);
      }
    }
    
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
      select: selectFields
    });
    res.json(equipo);
  } catch (error) {
    next(error);
  }
};

const remover = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const equipoExistente = await prisma.equipo.findUnique({
      where: { id_equipo: BigInt(id) }
    });
    
    if (!equipoExistente) {
      const error = new Error('El equipo que intentas desactivar no existe');
      error.status = 404;
      return next(error);
    }
    
    if (equipoExistente.estado === 0) {
      const error = new Error('El equipo ya está desactivado');
      error.status = 400;
      return next(error);
    }
    
    // Verificar diagnósticos asociados
    const diagnosticosAsociados = await prisma.diagnostico.count({
      where: { id_equipo: BigInt(id) }
    });
    
    if (diagnosticosAsociados > 0) {
      const error = new Error(`No se puede desactivar el equipo porque tiene ${diagnosticosAsociados} diagnóstico(s) asociado(s)`);
      error.status = 400;
      return next(error);
    }
    
    const equipo = await prisma.equipo.update({
      where: { id_equipo: BigInt(id) },
      data: { estado: 0 },
      select: selectFields
    });
    res.json({ message: 'Equipo desactivado correctamente', equipo });
  } catch (error) {
    next(error);
  }
};

module.exports = { ObtenerTodos, ObtenerPorId, Crear, Actualizar, remover };