const prisma = require('../config/prisma');

// Configuración de campos a seleccionar (sin timestamps)
const selectFields = {
  id_orden: true,
  fecha_ingreso: true,
  fecha_entrega: true,
  problema_reportado: true,
  costo: true,
  estado: true,
  id_cliente: true,
  id_personal: true
};

const ObtenerTodos = async (req, res, next) => {
  try {
    const ordenes = await prisma.orden.findMany({
      select: selectFields
    });
    res.json(ordenes);
  } catch (error) {
    next(error);
  }
};

const ObtenerPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const orden = await prisma.orden.findUnique({ 
      where: { id_orden: BigInt(id) },
      select: selectFields
    });
    if (!orden) {
      const error = new Error('Orden no encontrada');
      error.status = 404;
      return next(error);
    }
    res.json(orden);
  } catch (error) {
    next(error);
  }
};

const Crear = async (req, res, next) => {
  try {
    const { id_cliente, id_personal, fecha_ingreso, fecha_entrega, problema_reportado, costo, estado } = req.body;
    
    // Verificar que el cliente existe
    const clienteExiste = await prisma.cliente.findUnique({
      where: { id_cliente: BigInt(id_cliente) }
    });
    
    if (!clienteExiste) {
      const error = new Error('El cliente especificado no existe');
      error.status = 400;
      return next(error);
    }
    
    if (clienteExiste.estado === 0) {
      const error = new Error('No se puede crear una orden para un cliente desactivado');
      error.status = 400;
      return next(error);
    }
    
    // Verificar que el personal existe
    const personalExiste = await prisma.personal.findUnique({
      where: { id_personal: BigInt(id_personal) }
    });
    
    if (!personalExiste) {
      const error = new Error('El personal especificado no existe');
      error.status = 400;
      return next(error);
    }
    
    if (personalExiste.estado === 0) {
      const error = new Error('No se puede asignar una orden a personal desactivado');
      error.status = 400;
      return next(error);
    }
    
    // Verificar fechas lógicas
    if (fecha_entrega && fecha_ingreso && new Date(fecha_entrega) < new Date(fecha_ingreso)) {
      const error = new Error('La fecha de entrega no puede ser anterior a la fecha de ingreso');
      error.status = 400;
      return next(error);
    }
    
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
      select: selectFields
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
    
    // Verificar si la orden existe
    const ordenExistente = await prisma.orden.findUnique({
      where: { id_orden: BigInt(id) }
    });
    
    if (!ordenExistente) {
      const error = new Error('La orden que intentas actualizar no existe');
      error.status = 404;
      return next(error);
    }
    
    if (ordenExistente.estado === 'Anulado') {
      const error = new Error('No se puede actualizar una orden anulada');
      error.status = 400;
      return next(error);
    }
    
    // Validar relaciones si se cambian
    if (id_cliente) {
      const clienteExiste = await prisma.cliente.findUnique({
        where: { id_cliente: BigInt(id_cliente) }
      });
      
      if (!clienteExiste || clienteExiste.estado === 0) {
        const error = new Error('El cliente especificado no existe o está desactivado');
        error.status = 400;
        return next(error);
      }
    }
    
    if (id_personal) {
      const personalExiste = await prisma.personal.findUnique({
        where: { id_personal: BigInt(id_personal) }
      });
      
      if (!personalExiste || personalExiste.estado === 0) {
        const error = new Error('El personal especificado no existe o está desactivado');
        error.status = 400;
        return next(error);
      }
    }
    
    // Verificar fechas lógicas
    if (fecha_entrega && fecha_ingreso && new Date(fecha_entrega) < new Date(fecha_ingreso)) {
      const error = new Error('La fecha de entrega no puede ser anterior a la fecha de ingreso');
      error.status = 400;
      return next(error);
    }
    
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
      select: selectFields
    });
    res.json(orden);
  } catch (error) {
    next(error);
  }
};

const remover = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const ordenExistente = await prisma.orden.findUnique({
      where: { id_orden: BigInt(id) }
    });
    
    if (!ordenExistente) {
      const error = new Error('La orden que intentas anular no existe');
      error.status = 404;
      return next(error);
    }
    
    if (ordenExistente.estado === 'Anulado') {
      const error = new Error('La orden ya está anulada');
      error.status = 400;
      return next(error);
    }
    
    if (ordenExistente.estado === 'finalizada') {
      const error = new Error('No se puede anular una orden finalizada');
      error.status = 400;
      return next(error);
    }
    
    // Verificar diagnósticos asociados
    const diagnosticosAsociados = await prisma.diagnostico.count({
      where: { id_orden: BigInt(id) }
    });
    
    if (diagnosticosAsociados > 0) {
      const error = new Error(`No se puede anular la orden porque tiene ${diagnosticosAsociados} diagnóstico(s) asociado(s)`);
      error.status = 400;
      return next(error);
    }
    
    // Soft delete: cambiar estado a "Anulado" en lugar de eliminar
    const orden = await prisma.orden.update({
      where: { id_orden: BigInt(id) },
      data: { estado: 'Anulado' },
      select: selectFields
    });
    res.json({ message: 'Orden anulada correctamente', orden });
  } catch (error) {
    next(error);
  }
};

module.exports = { ObtenerTodos, ObtenerPorId, Crear, Actualizar, remover };