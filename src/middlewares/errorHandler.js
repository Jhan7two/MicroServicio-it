function errorHandler(err, req, res, next) {
  console.error('Error capturado:', err);

  // Errores de Prisma
  if (err.code) {
    return handlePrismaError(err, res);
  }

  // Errores de validación (express-validator)
  if (err.array) {
    return res.status(400).json({
      error: 'Errores de validación',
      detalles: err.array().map(error => ({
        campo: error.path,
        valor: error.value,
        mensaje: error.msg
      }))
    });
  }

  // Error personalizado
  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';
  
  res.status(status).json({
    error: message,
    timestamp: new Date().toISOString()
  });
}

// Manejo específico de errores de Prisma en español
function handlePrismaError(err, res) {
  switch (err.code) {
    case 'P2002':
      return res.status(409).json({
        error: 'Ya existe un registro con estos datos únicos',
        campo: err.meta?.target?.[0] || 'campo único',
        codigo: err.code
      });
    
    case 'P2025':
      return res.status(404).json({
        error: 'El registro que intentas actualizar o eliminar no existe',
        detalles: 'Verifica que el ID sea correcto y que el registro exista en la base de datos',
        codigo: err.code
      });
    
    case 'P2003':
      return res.status(400).json({
        error: 'Error de relación entre tablas',
        detalles: 'El registro que intentas vincular no existe o ya está siendo utilizado',
        codigo: err.code
      });
    
    case 'P2014':
      return res.status(400).json({
        error: 'Error de relación requerida',
        detalles: 'La operación viola una restricción de relación en la base de datos',
        codigo: err.code
      });
    
    default:
      return res.status(500).json({
        error: 'Error de base de datos',
        detalles: 'Ocurrió un error inesperado en la base de datos',
        codigo: err.code
      });
  }
}

module.exports = errorHandler;
