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
 *               id_equipo:
 *                 type: integer
 *               descripcion:
 *                 type: string
 *               solucion:
 *                 type: string
 *               fecha:
 *                 type: string
 *                 format: date
 *               observacion:
 *                 type: string
 *               estado:
 *                 type: string
 *             required:
 *               - id_orden
 *               - id_equipo
 *     responses:
 *       201:
 *         description: Diagnóstico creado
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
 *     responses:
 *       200:
 *         description: Diagnóstico encontrado
 *       404:
 *         description: No encontrado
 *   put:
 *     summary: Actualizar diagnóstico
 *     tags: [Diagnosticos]
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
 *               id_orden:
 *                 type: integer
 *               id_equipo:
 *                 type: integer
 *               descripcion:
 *                 type: string
 *               solucion:
 *                 type: string
 *               fecha:
 *                 type: string
 *                 format: date
 *               observacion:
 *                 type: string
 *               estado:
 *                 type: string
 *     responses:
 *       200:
 *         description: Diagnóstico actualizado
 *   delete:
 *     summary: Eliminar diagnóstico
 *     tags: [Diagnosticos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Diagnóstico eliminado
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
 *     responses:
 *       200:
 *         description: Lista de diagnósticos por orden
 */
const express = require('express');
const { body, validationResult } = require('express-validator');
const controller = require('../controllers/diagnosticosController');
const router = express.Router();

const validations = [
  body('id_orden').notEmpty().withMessage('id_orden es obligatorio').isInt().withMessage('id_orden debe ser entero'),
  body('id_equipo').notEmpty().withMessage('id_equipo es obligatorio').isInt().withMessage('id_equipo debe ser entero'),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.get('/orden/:id', controller.getByOrdenId);
router.post('/', validations, validate, controller.create);
router.put('/:id', validations, validate, controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
