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
 *               id_modelo:
 *                 type: integer
 *               numero_serie:
 *                 type: string
 *               color:
 *                 type: string
 *               accesorios:
 *                 type: string
 *               estado:
 *                 type: integer
 *             required:
 *               - id_marca
 *               - id_modelo
 *               - numero_serie
 *     responses:
 *       201:
 *         description: Equipo creado
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
 *     responses:
 *       200:
 *         description: Equipo encontrado
 *       404:
 *         description: No encontrado
 *   put:
 *     summary: Actualizar equipo
 *     tags: [Equipos]
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
 *               id_marca:
 *                 type: integer
 *               id_modelo:
 *                 type: integer
 *               numero_serie:
 *                 type: string
 *               color:
 *                 type: string
 *               accesorios:
 *                 type: string
 *               estado:
 *                 type: integer
 *             required:
 *               - id_marca
 *               - id_modelo
 *               - numero_serie
 *     responses:
 *       200:
 *         description: Equipo actualizado
 *   delete:
 *     summary: Eliminar equipo
 *     tags: [Equipos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Equipo eliminado
 */
const express = require('express');
const { body, validationResult } = require('express-validator');
const controller = require('../controllers/equiposController');
const router = express.Router();

const validations = [
  body('id_marca').notEmpty().withMessage('id_marca es obligatorio').isInt().withMessage('id_marca debe ser entero'),
  body('id_modelo').notEmpty().withMessage('id_modelo es obligatorio').isInt().withMessage('id_modelo debe ser entero'),
  body('numero_serie').notEmpty().withMessage('numero_serie es obligatorio'),
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
