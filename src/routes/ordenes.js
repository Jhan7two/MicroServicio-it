/**
 * @swagger
 * tags:
 *   name: OrdenesServicio
 *   description: Gestión de órdenes de servicio
 *
 * /ordenes_servicio:
 *   get:
 *     summary: Obtener todas las órdenes de servicio
 *     tags: [OrdenesServicio]
 *     responses:
 *       200:
 *         description: Lista de órdenes de servicio
 *   post:
 *     summary: Crear una orden de servicio
 *     tags: [OrdenesServicio]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_cliente:
 *                 type: integer
 *               id_personal:
 *                 type: integer
 *               fecha_ingreso:
 *                 type: string
 *                 format: date-time
 *               fecha_entrega:
 *                 type: string
 *                 format: date-time
 *               problema_reportado:
 *                 type: string
 *               costo:
 *                 type: number
 *               estado:
 *                 type: string
 *             required:
 *               - id_cliente
 *               - id_personal
 *               - problema_reportado
 *     responses:
 *       201:
 *         description: Orden creada
 *
 * /ordenes_servicio/{id}:
 *   get:
 *     summary: Obtener una orden por ID
 *     tags: [OrdenesServicio]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Orden encontrada
 *       404:
 *         description: Orden no encontrada
 *   put:
 *     summary: Actualizar una orden de servicio
 *     tags: [OrdenesServicio]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_cliente:
 *                 type: integer
 *               id_personal:
 *                 type: integer
 *               fecha_ingreso:
 *                 type: string
 *                 format: date-time
 *               fecha_entrega:
 *                 type: string
 *                 format: date-time
 *               problema_reportado:
 *                 type: string
 *               costo:
 *                 type: number
 *               estado:
 *                 type: string
 *     responses:
 *       200:
 *         description: Orden actualizada
 *   delete:
 *     summary: Eliminar una orden de servicio
 *     tags: [OrdenesServicio]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Orden eliminada
 *
 * /ordenes_servicio/{id}/diagnosticos:
 *   get:
 *     summary: Obtener diagnósticos de una orden de servicio
 *     tags: [OrdenesServicio]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de diagnósticos
 */
const express = require('express');
const { body, validationResult } = require('express-validator');
const controller = require('../controllers/ordenesController');
const diagnosticosController = require('../controllers/diagnosticosController');
const router = express.Router();

const validations = [
  body('id_cliente').notEmpty().withMessage('id_cliente es obligatorio').isInt().withMessage('id_cliente debe ser entero'),
  body('id_personal').notEmpty().withMessage('id_personal es obligatorio').isInt().withMessage('id_personal debe ser entero'),
  body('problema_reportado').notEmpty().withMessage('problema_reportado es obligatorio'),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.get('/:id/diagnosticos', diagnosticosController.getByOrdenId);
router.post('/', validations, validate, controller.create);
router.put('/:id', validations, validate, controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
