/**
 * @swagger
 * tags:
 *   name: Equipos
 *   description: Gestión de equipos
 *
 * /equipos:
 *   get:
 *     summary: Obtener todos los equipos
 *     tags: [Equipos]
 *     responses:
 *       200:
 *         description: Lista de equipos
 *   post:
 *     summary: Crear un equipo
 *     tags: [Equipos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_marca:
 *                 type: integer
 *                 example: 1
 *               id_modelo:
 *                 type: integer
 *                 example: 1
 *               numero_serie:
 *                 type: string
 *                 example: "ABC123456789"
 *               color:
 *                 type: string
 *                 example: "Negro"
 *               accesorios:
 *                 type: string
 *                 example: "Cargador, cable USB, funda"
 *               estado:
 *                 type: integer
 *                 example: 1
 *             required:
 *               - id_marca
 *               - id_modelo
 *               - numero_serie
 *     responses:
 *       201:
 *         description: Equipo creado exitosamente
 *       400:
 *         description: Errores de validación
 *       409:
 *         description: El número de serie ya existe
 *
 * /equipos/{id}:
 *   get:
 *     summary: Obtener equipo por ID
 *     tags: [Equipos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Equipo encontrado
 *       404:
 *         description: Equipo no encontrado
 *   put:
 *     summary: Actualizar equipo
 *     tags: [Equipos]
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
 *               id_marca:
 *                 type: integer
 *                 example: 1
 *               id_modelo:
 *                 type: integer
 *                 example: 1
 *               numero_serie:
 *                 type: string
 *                 example: "ABC123456789"
 *               color:
 *                 type: string
 *                 example: "Negro mate"
 *               accesorios:
 *                 type: string
 *                 example: "Cargador, cable USB, funda, protector"
 *               estado:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Equipo actualizado
 *       400:
 *         description: Errores de validación
 *       404:
 *         description: Equipo no encontrado
 *       409:
 *         description: El número de serie ya existe en otro registro
 *   delete:
 *     summary: Desactivar equipo (soft delete)
 *     tags: [Equipos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Equipo desactivado correctamente
 *       400:
 *         description: Equipo ya desactivado o tiene diagnósticos asociados
 *       404:
 *         description: Equipo no encontrado
 */
const express = require('express');
const controller = require('../controllers/equiposController');
const { validarEquipo, validarId } = require('../middlewares/validaciones');
const router = express.Router();

router.get('/', controller.ObtenerTodos);
router.get('/:id', validarId, controller.ObtenerPorId);
router.post('/', validarEquipo, controller.Crear);
router.put('/:id', validarId, validarEquipo, controller.Actualizar);
router.delete('/:id', validarId, controller.remover);

module.exports = router;
