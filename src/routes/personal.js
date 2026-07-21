/**
 * @swagger
 * tags:
 *   name: Personal
 *   description: Gestión de personal
 *
 * /personal:
 *   get:
 *     summary: Obtener todo el personal
 *     tags: [Personal]
 *     responses:
 *       200:
 *         description: Lista de personal
 *   post:
 *     summary: Crear un registro de personal
 *     tags: [Personal]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Juan"
 *               apellido:
 *                 type: string
 *                 example: "Pérez"
 *               cargo:
 *                 type: string
 *                 example: "Técnico Senior"
 *               telefono:
 *                 type: string
 *                 example: "77712345"
 *               correo:
 *                 type: string
 *                 example: "juan.perez@empresa.com"
 *               estado:
 *                 type: integer
 *                 description: "Estado del trabajador (1 para activo, 0 para inactivo)"
 *                 example: 1
 *             required:
 *               - nombre
 *               - apellido
 *               - correo
 *     responses:
 *       201:
 *         description: Personal creado exitosamente
 *       400:
 *         description: Errores de validación
 *       409:
 *         description: El correo ya existe
 *
 * /personal/{id}:
 *   get:
 *     summary: Obtener personal por ID
 *     tags: [Personal]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Personal encontrado
 *       404:
 *         description: Personal no encontrado
 *   put:
 *     summary: Actualizar personal
 *     tags: [Personal]
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
 *               nombre:
 *                 type: string
 *                 example: "Juan Carlos"
 *               apellido:
 *                 type: string
 *                 example: "Pérez López"
 *               cargo:
 *                 type: string
 *                 example: "Técnico Senior"
 *               telefono:
 *                 type: string
 *                 example: "77712345"
 *               correo:
 *                 type: string
 *                 example: "juan.perez@empresa.com"
 *               estado:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Personal actualizado
 *       400:
 *         description: Errores de validación
 *       404:
 *         description: Personal no encontrado
 *       409:
 *         description: El correo ya existe en otro registro
 *   delete:
 *     summary: Desactivar personal (soft delete)
 *     tags: [Personal]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Personal desactivado correctamente
 *       400:
 *         description: Personal ya desactivado o tiene órdenes activas
 *       404:
 *         description: Personal no encontrado
 */
const express = require('express');
const controller = require('../controllers/personalController');
const { validarPersonal, validarId } = require('../middlewares/validaciones');
const router = express.Router();

router.get('/', controller.ObtenerTodos);
router.get('/:id', validarId, controller.ObtenerPorId);
router.post('/', validarPersonal, controller.Crear);
router.put('/:id', validarId, validarPersonal, controller.Actualizar);
router.delete('/:id', validarId, controller.remover);

module.exports = router;
