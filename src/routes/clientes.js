/**
 * @swagger
 * tags:
 *   name: Clientes
 *   description: Gestión de clientes
 *
 * /clientes:
 *   get:
 *     summary: Obtener todos los clientes
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de clientes
 *   post:
 *     summary: Crear un cliente
 *     tags: [Clientes]
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
 *               nit_ci:
 *                 type: string
 *                 example: "1234567"
 *               telefono:
 *                 type: string
 *                 example: "77712345"
 *               correo:
 *                 type: string
 *                 example: "juan.perez@correo.com"
 *               direccion:
 *                 type: string
 *                 example: "Av. Ballivián #123"
 *               estado:
 *                 type: integer
 *                 example: 1
 *             required:
 *               - nombre
 *               - apellido
 *               - nit_ci
 *               - correo
 *     responses:
 *       201:
 *         description: Cliente creado exitosamente
 *       400:
 *         description: Errores de validación
 *       409:
 *         description: El correo o NIT/CI ya existe
 *
 * /clientes/{id}:
 *   get:
 *     summary: Obtener cliente por ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *       404:
 *         description: Cliente no encontrado
 *   put:
 *     summary: Actualizar cliente
 *     tags: [Clientes]
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
 *               nit_ci:
 *                 type: string
 *                 example: "1234567"
 *               telefono:
 *                 type: string
 *                 example: "77712345"
 *               correo:
 *                 type: string
 *                 example: "juan.perez@correo.com"
 *               direccion:
 *                 type: string
 *                 example: "Av. Ballivián #123"
 *               estado:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Cliente actualizado
 *       400:
 *         description: Errores de validación
 *       404:
 *         description: Cliente no encontrado
 *       409:
 *         description: El correo o NIT/CI ya existe en otro registro
 *   delete:
 *     summary: Desactivar cliente (soft delete)
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Cliente desactivado correctamente
 *       400:
 *         description: Cliente ya desactivado o tiene órdenes activas
 *       404:
 *         description: Cliente no encontrado
 */
const express = require('express');
const controller = require('../controllers/clientesController');
const { validarCliente, validarId } = require('../middlewares/validaciones');
const router = express.Router();

router.get('/', controller.ObtenerTodos);
router.get('/:id', validarId, controller.ObtenerPorId);
router.post('/', validarCliente, controller.Crear);
router.put('/:id', validarId, validarCliente, controller.Actualizar);
router.delete('/:id', validarId, controller.remover);

module.exports = router;
