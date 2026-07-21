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
    if (!cliente) {
      const error = new Error('Cliente no encontrado');
      error.status = 404;
      return next(error);
    }
    res.json(cliente);
  } catch (error) {
    next(error);
  }
};

const Crear = async (req, res, next) => {
  try {
    const { nombre, apellido, nit_ci, telefono, correo, direccion, estado } = req.body;
    
    // Verificar si el correo ya existe
    const correoExistente = await prisma.cliente.findFirst({
      where: { correo }
    });
    
    if (correoExistente) {
      const error = new Error('Ya existe un cliente con este correo electrónico');
      error.status = 409;
      return next(error);
    }
    
    // Verificar si el NIT/CI ya existe
    const nitExistente = await prisma.cliente.findFirst({
      where: { nit_ci }
    });
    
    if (nitExistente) {
      const error = new Error('Ya existe un cliente con este NIT/CI');
      error.status = 409;
      return next(error);
    }
    
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
    
    // Verificar si el registro existe antes de actualizar
    const clienteExistente = await prisma.cliente.findUnique({
      where: { id_cliente: BigInt(id) }
    });
    
    if (!clienteExistente) {
      const error = new Error('El cliente que intentas actualizar no existe');
      error.status = 404;
      return next(error);
    }
    
    // Si se cambia el correo, verificar que no exista en otro registro
    if (correo && correo !== clienteExistente.correo) {
      const correoExistente = await prisma.cliente.findFirst({
        where: { 
          correo,
          id_cliente: { not: BigInt(id) }
        }
      });
      
      if (correoExistente) {
        const error = new Error('Ya existe otro cliente con este correo electrónico');
        error.status = 409;
        return next(error);
      }
    }
    
    // Si se cambia el NIT/CI, verificar que no exista en otro registro
    if (nit_ci && nit_ci !== clienteExistente.nit_ci) {
      const nitExistente = await prisma.cliente.findFirst({
        where: { 
          nit_ci,
          id_cliente: { not: BigInt(id) }
        }
      });
      
      if (nitExistente) {
        const error = new Error('Ya existe otro cliente con este NIT/CI');
        error.status = 409;
        return next(error);
      }
    }
    
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
    
    // Verificar si el registro existe antes de desactivar
    const clienteExistente = await prisma.cliente.findUnique({
      where: { id_cliente: BigInt(id) }
    });
    
    if (!clienteExistente) {
      const error = new Error('El cliente que intentas desactivar no existe');
      error.status = 404;
      return next(error);
    }
    
    if (clienteExistente.estado === 0) {
      const error = new Error('El cliente ya está desactivado');
      error.status = 400;
      return next(error);
    }
    
    // Verificar si tiene órdenes activas
    const ordenesActivas = await prisma.orden.count({
      where: { 
        id_cliente: BigInt(id),
        estado: { not: 'Anulado' }
      }
    });
    
    if (ordenesActivas > 0) {
      const error = new Error(`No se puede desactivar el cliente porque tiene ${ordenesActivas} orden(es) de servicio activa(s)`);
      error.status = 400;
      return next(error);
    }
    
    // Soft delete: cambiar estado a 0 (inactivo) en lugar de eliminar
    const cliente = await prisma.cliente.update({
      where: { id_cliente: BigInt(id) },
      data: { estado: 0 },
      select: myselect
    });
    res.json({ message: 'Cliente desactivado correctamente', cliente });
  } catch (error) {
    next(error);
  }
};

module.exports = { ObtenerTodos, ObtenerPorId, Crear, Actualizar, remover };