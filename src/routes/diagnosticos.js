/**
 * @swagger
 * tags:
 *   name: Diagnosticos
 *   description: Gestión de diagnósticos
 *
 * /diagnosticos:
 *   get:
 *     summary: Obtener todos los diagnósticos
 *     tags: [Diagnosticos]
 *     responses:
 *       200:
 *         description: Lista de diagnósticos
 *   post:
 *     summary: Crear un diagnóstico
 *     tags: [Diagnosticos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_orden:
 *                 type: integer
 *                 example: 1
 *               id_equipo:
 *                 type: integer
 *                 example: 1
 *               descripcion:
 *                 type: string
 *                 example: "Pantalla rota, cristal fracturado en esquina superior derecha"
 *               solucion:
 *                 type: string
 *                 example: "Reemplazar pantalla LCD completa"
 *               fecha:
 *                 type: string
 *                 format: date
 *                 example: "2024-07-20"
 *               observacion:
 *                 type: string
 *                 example: "Cliente reporta que el equipo se cayó desde 1 metro"
 *               estado:
 *                 type: string
 *                 enum: [pendiente, confirmado, reparado]
 *                 example: "pendiente"
 *             required:
 *               - id_orden
 *               - id_equipo
 *               - descripcion
 *     responses:
 *       201:
 *         description: Diagnóstico creado exitosamente
 *       400:
 *         description: Errores de validación
 *
 * /diagnosticos/{id}:
 *   get:
 *     summary: Obtener diagnóstico por ID
 *     tags: [Diagnosticos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Diagnóstico encontrado
 *       404:
 *         description: Diagnóstico no encontrado
 *   put:
 *     summary: Actualizar diagnóstico
 *     tags: [Diagnosticos]
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
 *               id_orden:
 *                 type: integer
 *                 example: 1
 *               id_equipo:
 *                 type: integer
 *                 example: 1
 *               descripcion:
 *                 type: string
 *                 example: "Pantalla rota, cristal fracturado en esquina superior derecha"
 *               solucion:
 *                 type: string
 *                 example: "Pantalla LCD reemplazada exitosamente"
 *               fecha:
 *                 type: string
 *                 format: date
 *                 example: "2024-07-20"
 *               observacion:
 *                 type: string
 *                 example: "Reparación completada, equipo funciona correctamente"
 *               estado:
 *                 type: string
 *                 enum: [pendiente, confirmado, reparado]
 *                 example: "reparado"
 *     responses:
 *       200:
 *         description: Diagnóstico actualizado
 *       400:
 *         description: Errores de validación
 *       404:
 *         description: Diagnóstico no encontrado
 *   delete:
 *     summary: Reiniciar diagnóstico a estado pendiente
 *     tags: [Diagnosticos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Diagnóstico reiniciado a estado pendiente
 *       400:
 *         description: El diagnóstico ya está en estado pendiente
 *       404:
 *         description: Diagnóstico no encontrado
 *
 * /diagnosticos/orden/{id}:
 *   get:
 *     summary: Obtener diagnósticos por orden de servicio
 *     tags: [Diagnosticos]
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
 *       404:
 *         description: Orden no encontrada
 */
const express = require('express');
const controller = require('../controllers/diagnosticosController');
const { validarDiagnostico, validarId } = require('../middlewares/validaciones');
const router = express.Router();

router.get('/', controller.ObtenerTodos);
router.get('/:id', validarId, controller.ObtenerPorId);
router.get('/orden/:id', validarId, controller.ObtenerPorOrdenId);
router.post('/', validarDiagnostico, controller.Crear);
router.put('/:id', validarId, validarDiagnostico, controller.Actualizar);
router.delete('/:id', validarId, controller.remover);

module.exports = router;
