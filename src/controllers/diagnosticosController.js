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
    if (!diagnostico) {
      const error = new Error('Diagnóstico no encontrado');
      error.status = 404;
      return next(error);
    }
    res.json(diagnostico);
  } catch (error) {
    next(error);
  }
};

const ObtenerPorOrdenId = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Verificar que la orden existe
    const ordenExiste = await prisma.orden.findUnique({
      where: { id_orden: BigInt(id) }
    });
    
    if (!ordenExiste) {
      const error = new Error('La orden especificada no existe');
      error.status = 404;
      return next(error);
    }
    
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
    
    // Verificar que la orden existe y no está anulada
    const ordenExiste = await prisma.orden.findUnique({
      where: { id_orden: BigInt(id_orden) }
    });
    
    if (!ordenExiste) {
      const error = new Error('La orden especificada no existe');
      error.status = 400;
      return next(error);
    }
    
    if (ordenExiste.estado === 'Anulado') {
      const error = new Error('No se puede crear un diagnóstico para una orden anulada');
      error.status = 400;
      return next(error);
    }
    
    // Verificar que el equipo existe
    const equipoExiste = await prisma.equipo.findUnique({
      where: { id_equipo: BigInt(id_equipo) }
    });
    
    if (!equipoExiste) {
      const error = new Error('El equipo especificado no existe');
      error.status = 400;
      return next(error);
    }
    
    if (equipoExiste.estado === 0) {
      const error = new Error('No se puede crear un diagnóstico para un equipo desactivado');
      error.status = 400;
      return next(error);
    }
    
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
    
    // Verificar que el diagnóstico existe
    const diagnosticoExistente = await prisma.diagnostico.findUnique({
      where: { id_diagnostico: BigInt(id) }
    });
    
    if (!diagnosticoExistente) {
      const error = new Error('El diagnóstico que intentas actualizar no existe');
      error.status = 404;
      return next(error);
    }
    
    // Verificar relaciones si se cambian
    if (id_orden) {
      const ordenExiste = await prisma.orden.findUnique({
        where: { id_orden: BigInt(id_orden) }
      });
      
      if (!ordenExiste || ordenExiste.estado === 'Anulado') {
        const error = new Error('La orden especificada no existe o está anulada');
        error.status = 400;
        return next(error);
      }
    }
    
    if (id_equipo) {
      const equipoExiste = await prisma.equipo.findUnique({
        where: { id_equipo: BigInt(id_equipo) }
      });
      
      if (!equipoExiste || equipoExiste.estado === 0) {
        const error = new Error('El equipo especificado no existe o está desactivado');
        error.status = 400;
        return next(error);
      }
    }
    
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
    
    const diagnosticoExistente = await prisma.diagnostico.findUnique({
      where: { id_diagnostico: BigInt(id) }
    });
    
    if (!diagnosticoExistente) {
      const error = new Error('El diagnóstico que intentas reiniciar no existe');
      error.status = 404;
      return next(error);
    }
    
    if (diagnosticoExistente.estado === 'pendiente') {
      const error = new Error('El diagnóstico ya está en estado pendiente');
      error.status = 400;
      return next(error);
    }
    
    // Soft delete: cambiar estado a pendiente (reiniciar diagnóstico)
    const diagnostico = await prisma.diagnostico.update({
      where: { id_diagnostico: BigInt(id) },
      data: { estado: 'pendiente' },
      select: myselect
    });
    res.json({ message: 'Diagnóstico reiniciado a estado pendiente', diagnostico });
  } catch (error) {
    next(error);
  }
};

module.exports = { ObtenerTodos, ObtenerPorId, ObtenerPorOrdenId, Crear, Actualizar, remover };