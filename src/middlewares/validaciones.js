const { body, param, validationResult } = require('express-validator');

// Middleware para manejar errores de validación
const manejarErroresValidacion = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    const error = new Error('Errores de validación');
    error.status = 400;
    error.array = () => errores.array();
    return next(error);
  }
  next();
};

// Validaciones para Cliente
const validarCliente = [
  body('nombre')
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .matches(/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),
  
  body('apellido')
    .isLength({ min: 2, max: 50 })
    .withMessage('El apellido debe tener entre 2 y 50 caracteres')
    .matches(/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/)
    .withMessage('El apellido solo puede contener letras y espacios'),
  
  body('correo')
    .isEmail()
    .withMessage('Debe ser un correo electrónico válido')
    .normalizeEmail(),
  
  body('nit_ci')
    .isLength({ min: 7, max: 15 })
    .withMessage('El NIT/CI debe tener entre 7 y 15 caracteres')
    .isAlphanumeric()
    .withMessage('El NIT/CI solo puede contener letras y números'),
  
  body('telefono')
    .optional()
    .isMobilePhone('es-BO')
    .withMessage('Debe ser un número de teléfono válido de Bolivia'),
  
  body('estado')
    .optional()
    .isIn([0, 1])
    .withMessage('El estado debe ser 0 (inactivo) o 1 (activo)'),
  
  manejarErroresValidacion
];

// Validaciones para Personal
const validarPersonal = [
  body('nombre')
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .matches(/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),
  
  body('apellido')
    .isLength({ min: 2, max: 50 })
    .withMessage('El apellido debe tener entre 2 y 50 caracteres')
    .matches(/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/)
    .withMessage('El apellido solo puede contener letras y espacios'),
  
  body('correo')
    .isEmail()
    .withMessage('Debe ser un correo electrónico válido')
    .normalizeEmail(),
  
  body('cargo')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('El cargo debe tener entre 2 y 100 caracteres'),
  
  body('telefono')
    .optional()
    .isMobilePhone('es-BO')
    .withMessage('Debe ser un número de teléfono válido de Bolivia'),
  
  body('estado')
    .optional()
    .isIn([0, 1])
    .withMessage('El estado debe ser 0 (inactivo) o 1 (activo)'),
  
  manejarErroresValidacion
];

// Validaciones para Marca
const validarMarca = [
  body('nombre_marca')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre de la marca debe tener entre 2 y 100 caracteres')
    .matches(/^[A-Za-z0-9ÁáÉéÍíÓóÚúÑñ\s\-\.]+$/)
    .withMessage('El nombre de la marca contiene caracteres no válidos'),
  
  body('pais_origen')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('El país de origen debe tener entre 2 y 50 caracteres')
    .matches(/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/)
    .withMessage('El país solo puede contener letras y espacios'),
  
  body('estado')
    .optional()
    .isIn([0, 1])
    .withMessage('El estado debe ser 0 (inactivo) o 1 (activo)'),
  
  manejarErroresValidacion
];

// Validaciones para Modelo
const validarModelo = [
  body('nombre_modelo')
    .isLength({ min: 1, max: 100 })
    .withMessage('El nombre del modelo debe tener entre 1 y 100 caracteres')
    .matches(/^[A-Za-z0-9ÁáÉéÍíÓóÚúÑñ\s\-\.]+$/)
    .withMessage('El nombre del modelo contiene caracteres no válidos'),
  
  body('estado')
    .optional()
    .isIn([0, 1])
    .withMessage('El estado debe ser 0 (inactivo) o 1 (activo)'),
  
  manejarErroresValidacion
];

// Validaciones para Equipo
const validarEquipo = [
  body('numero_serie')
    .isLength({ min: 5, max: 50 })
    .withMessage('El número de serie debe tener entre 5 y 50 caracteres')
    .isAlphanumeric()
    .withMessage('El número de serie solo puede contener letras y números'),
  
  body('id_marca')
    .isNumeric()
    .withMessage('El ID de marca debe ser un número válido'),
  
  body('id_modelo')
    .isNumeric()
    .withMessage('El ID de modelo debe ser un número válido'),
  
  body('color')
    .optional()
    .isLength({ min: 2, max: 30 })
    .withMessage('El color debe tener entre 2 y 30 caracteres'),
  
  body('estado')
    .optional()
    .isIn([0, 1])
    .withMessage('El estado debe ser 0 (inactivo) o 1 (activo)'),
  
  manejarErroresValidacion
];

// Validaciones para Orden
const validarOrden = [
  body('id_cliente')
    .isNumeric()
    .withMessage('El ID de cliente debe ser un número válido'),
  
  body('id_personal')
    .isNumeric()
    .withMessage('El ID de personal debe ser un número válido'),
  
  body('problema_reportado')
    .isLength({ min: 10, max: 500 })
    .withMessage('El problema reportado debe tener entre 10 y 500 caracteres'),
  
  body('fecha_ingreso')
    .optional()
    .isISO8601()
    .withMessage('La fecha de ingreso debe tener formato válido (YYYY-MM-DD)'),
  
  body('fecha_entrega')
    .optional()
    .isISO8601()
    .withMessage('La fecha de entrega debe tener formato válido (YYYY-MM-DD)'),
  
  body('costo')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El costo debe ser un número positivo'),
  
  body('estado')
    .optional()
    .isIn(['pendiente', 'en_proceso', 'finalizada', 'Anulado'])
    .withMessage('El estado debe ser: pendiente, en_proceso, finalizada o Anulado'),
  
  manejarErroresValidacion
];

// Validaciones para Diagnóstico
const validarDiagnostico = [
  body('id_orden')
    .isNumeric()
    .withMessage('El ID de orden debe ser un número válido'),
  
  body('id_equipo')
    .isNumeric()
    .withMessage('El ID de equipo debe ser un número válido'),
  
  body('descripcion')
    .isLength({ min: 10, max: 500 })
    .withMessage('La descripción debe tener entre 10 y 500 caracteres'),
  
  body('solucion')
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage('La solución debe tener entre 10 y 500 caracteres'),
  
  body('fecha')
    .optional()
    .isISO8601()
    .withMessage('La fecha debe tener formato válido (YYYY-MM-DD)'),
  
  body('estado')
    .optional()
    .isIn(['pendiente', 'confirmado', 'reparado'])
    .withMessage('El estado debe ser: pendiente, confirmado o reparado'),
  
  manejarErroresValidacion
];

// Validación de ID en parámetros
const validarId = [
  param('id')
    .isNumeric()
    .withMessage('El ID debe ser un número válido')
    .custom((value) => {
      if (parseInt(value) <= 0) {
        throw new Error('El ID debe ser mayor a 0');
      }
      return true;
    }),
  
  manejarErroresValidacion
];

module.exports = {
  validarCliente,
  validarPersonal,
  validarMarca,
  validarModelo,
  validarEquipo,
  validarOrden,
  validarDiagnostico,
  validarId,
  manejarErroresValidacion
};