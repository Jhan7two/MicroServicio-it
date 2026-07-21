/**
 * @swagger
 * tags:
 *   name: Modelos
 *   description: Gestión de modelos de equipos
 *
 * /modelos:
 *   get:
 *     summary: Obtener todos los modelos
 *     tags: [Modelos]
 *     responses:
 *       200:
 *         description: Lista de modelos
 *   post:
 *     summary: Crear un modelo
 *     tags: [Modelos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_modelo:
 *                 type: string
 *                 example: "Galaxy S24"
 *               estado:
 *                 type: integer
 *                 example: 1
 *             required:
 *               - nombre_modelo
 *     responses:
 *       201:
 *         description: Modelo creado exitosamente
 *       400:
 *         description: Errores de validación
 *       409:
 *         description: El modelo ya existe
 *
 * /modelos/{id}:
 *   get:
 *     summary: Obtener modelo por ID
 *     tags: [Modelos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Modelo encontrado
 *       404:
 *         description: Modelo no encontrado
 *   put:
 *     summary: Actualizar modelo
 *     tags: [Modelos]
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
 *               nombre_modelo:
 *                 type: string
 *                 example: "Galaxy S24 Ultra"
 *               estado:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Modelo actualizado
 *       400:
 *         description: Errores de validación
 *       404:
 *         description: Modelo no encontrado
 *       409:
 *         description: El nombre del modelo ya existe en otro registro
 *   delete:
 *     summary: Desactivar modelo (soft delete)
 *     tags: [Modelos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Modelo desactivado correctamente
 *       400:
 *         description: Modelo ya desactivado o tiene equipos asociados
 *       404:
 *         description: Modelo no encontrado
 */
const express = require('express');
const controller = require('../controllers/modelosController');
const { validarModelo, validarId } = require('../middlewares/validaciones');
const router = express.Router();

router.get('/', controller.ObtenerTodos);
router.get('/:id', validarId, controller.ObtenerPorId);
router.post('/', validarModelo, controller.Crear);
router.put('/:id', validarId, validarModelo, controller.Actualizar);
router.delete('/:id', validarId, controller.remover);

module.exports = router;
