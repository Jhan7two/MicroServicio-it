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
 *               apellido:
 *                 type: string
 *               cargo:
 *                 type: string
 *               telefono:
 *                 type: string
 *               correo:
 *                 type: string
 *               especialidad:
 *                 type: string
 *               fecha_ingreso:
 *                 type: string
 *                 format: date
 *               estado:
 *                 type: boolean
 *             required:
 *               - nombre
 *               - apellido
 *     responses:
 *       201:
 *         description: Personal creado
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
 *     responses:
 *       200:
 *         description: Personal encontrado
 *       404:
 *         description: No encontrado
 *   put:
 *     summary: Actualizar personal
 *     tags: [Personal]
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
 *               cargo:
 *                 type: string
 *               telefono:
 *                 type: string
 *               correo:
 *                 type: string
 *               especialidad:
 *                 type: string
 *               fecha_ingreso:
 *                 type: string
 *                 format: date
 *               estado:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Personal actualizado
 *   delete:
 *     summary: Eliminar personal
 *     tags: [Personal]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Personal eliminado
 */
const express = require('express');
const { body, validationResult } = require('express-validator');
const controller = require('../controllers/personalController');
const router = express.Router();

const validations = [
  body('nombre').notEmpty().withMessage('Nombre es obligatorio'),
  body('apellido').notEmpty().withMessage('Apellido es obligatorio'),
  body('correo').optional().isEmail().withMessage('Correo no es válido'),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', validations, validate, controller.create);
router.put('/:id', validations, validate, controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
