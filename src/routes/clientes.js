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
 *               apellido:
 *                 type: string
*               nit_ci:
*                 type: string
 *               telefono:
 *                 type: string
 *               correo:
 *                 type: string
 *               direccion:
 *                 type: string
*               estado:
*                 type: integer
 *             required:
 *               - nombre
 *               - apellido
 *     responses:
 *       201:
 *         description: Cliente creado
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               nit_ci:
 *                 type: string
 *               telefono:
 *                 type: string
 *               correo:
 *                 type: string
 *               direccion:
 *                 type: string
 *               estado:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cliente actualizado
 *   delete:
 *     summary: Eliminar cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Cliente eliminado
 */
const express = require('express');
const { body, validationResult } = require('express-validator');
const controller = require('../controllers/clientesController');
const router = express.Router();

const validations = [
  body('nombre').notEmpty().withMessage('Nombre es obligatorio'),
  body('apellido').notEmpty().withMessage('Apellido es obligatorio'),
  body('correo').optional().isEmail().withMessage('Correo no es válido'),
    body('nit_ci').notEmpty().withMessage('Nit/Ci es obligatorio'),
    body('estado').isInt().withMessage('Estado debe ser un número entero'),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

router.get('/', controller.ObtenerTodos);
router.get('/:id', controller.ObtenerPorId);
router.post('/', validations, validate, controller.Crear);
router.put('/:id', validations, validate, controller.Actualizar);
router.delete('/:id', controller.remover);

module.exports = router;
