/**
 * @swagger
 * tags:
 *   name: Modelos
 *   description: Gestión de modelos
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
 *               estado:
 *                 type: integer
 *             required:
 *               - nombre_modelo
 *     responses:
 *       201:
 *         description: Modelo creado
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
 *     responses:
 *       200:
 *         description: Modelo encontrado
 *       404:
 *         description: No encontrado
 *   put:
 *     summary: Actualizar modelo
 *     tags: [Modelos]
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
 *               nombre_modelo:
 *                 type: string
 *               categoria:
 *                 type: string
 *               año_lanzamiento:
 *                 type: integer
 *               descripcion:
 *                 type: string
 *               estado:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Modelo actualizado
 *   delete:
 *     summary: Eliminar modelo
 *     tags: [Modelos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Modelo eliminado
 */
const express = require('express');
const { body, validationResult } = require('express-validator');
const controller = require('../controllers/modelosController');
const router = express.Router();

const validations = [
  body('nombre_modelo').notEmpty().withMessage('Nombre de modelo es obligatorio'),
  body('estado').optional().isInt().withMessage('Estado debe ser entero'),
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
