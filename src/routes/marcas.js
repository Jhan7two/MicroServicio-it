/**
 * @swagger
 * tags:
 *   name: Marcas
 *   description: Gestión de marcas
 *
 * /marcas:
 *   get:
 *     summary: Obtener todas las marcas
 *     tags: [Marcas]
 *     responses:
 *       200:
 *         description: Lista de marcas
 *   post:
 *     summary: Crear una marca
 *     tags: [Marcas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_marca:
 *                 type: string
 *               pais_origen:
 *                 type: string
 *               estado:
 *                 type: integer
 *             required:
 *               - nombre_marca
 *     responses:
 *       201:
 *         description: Marca creada
 *
 * /marcas/{id}:
 *   get:
 *     summary: Obtener marca por ID
 *     tags: [Marcas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Marca encontrada
 *       404:
 *         description: No encontrada
 *   put:
 *     summary: Actualizar marca
 *     tags: [Marcas]
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
 *               nombre_marca:
 *                 type: string
 *               pais_origen:
 *                 type: string
 *               sitio_web:
 *                 type: string
 *               estado:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Marca actualizada
 *   delete:
 *     summary: Eliminar marca
 *     tags: [Marcas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Marca eliminada
 */
const express = require('express');
const { body, validationResult } = require('express-validator');
const controller = require('../controllers/marcasController');
const router = express.Router();

const validations = [
  body('nombre_marca').notEmpty().withMessage('Nombre de marca es obligatorio'),
  body('estado').optional().isInt().withMessage('Estado debe ser entero'),
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
