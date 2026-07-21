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
 *                 example: 1
 *               id_personal:
 *                 type: integer
 *                 example: 1
 *               fecha_ingreso:
 *                 type: string
 *                 format: date
 *                 example: "2024-07-20"
 *               fecha_entrega:
 *                 type: string
 *                 format: date
 *                 example: "2024-07-25"
 *               problema_reportado:
 *                 type: string
 *                 example: "Pantalla no enciende después de caída"
 *               costo:
 *                 type: number
 *                 example: 150.50
 *               estado:
 *                 type: string
 *                 enum: [pendiente, en_proceso, finalizada, Anulado]
 *                 example: "pendiente"
 *             required:
 *               - id_cliente
 *               - id_personal
 *               - problema_reportado
 *     responses:
 *       201:
 *         description: Orden creada exitosamente
 *       400:
 *         description: Errores de validación
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
 *           example: 1
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
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_cliente:
 *                 type: integer
 *                 example: 1
 *               id_personal:
 *                 type: integer
 *                 example: 1
 *               fecha_ingreso:
 *                 type: string
 *                 format: date
 *                 example: "2024-07-20"
 *               fecha_entrega:
 *                 type: string
 *                 format: date
 *                 example: "2024-07-25"
 *               problema_reportado:
 *                 type: string
 *                 example: "Pantalla no enciende, revisar conectores internos"
 *               costo:
 *                 type: number
 *                 example: 175.00
 *               estado:
 *                 type: string
 *                 enum: [pendiente, en_proceso, finalizada, Anulado]
 *                 example: "en_proceso"
 *     responses:
 *       200:
 *         description: Orden actualizada
 *       400:
 *         description: Errores de validación
 *       404:
 *         description: Orden no encontrada
 *   delete:
 *     summary: Anular una orden de servicio (soft delete)
 *     tags: [OrdenesServicio]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Orden anulada correctamente
 *       400:
 *         description: Orden ya anulada o tiene diagnósticos asociados
 *       404:
 *         description: Orden no encontrada
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
 *           example: 1
 *     responses:
 *       200:
 *         description: Lista de diagnósticos de la orden
 */
const express = require('express');
const controller = require('../controllers/ordenesController');
const diagnosticosController = require('../controllers/diagnosticosController');
const { validarOrden, validarId } = require('../middlewares/validaciones');
const router = express.Router();

router.get('/', controller.ObtenerTodos);
router.get('/:id', validarId, controller.ObtenerPorId);
router.get('/:id/diagnosticos', validarId, diagnosticosController.ObtenerPorOrdenId);
router.post('/', validarOrden, controller.Crear);
router.put('/:id', validarId, validarOrden, controller.Actualizar);
router.delete('/:id', validarId, controller.remover);

module.exports = router;
