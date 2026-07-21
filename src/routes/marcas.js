/**
 * @swagger
 * tags:
 *   name: Marcas
 *   description: Gestión de marcas de equipos
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
 *                 example: "Samsung"
 *               pais_origen:
 *                 type: string
 *                 example: "Corea del Sur"
 *               estado:
 *                 type: integer
 *                 example: 1
 *             required:
 *               - nombre_marca
 *     responses:
 *       201:
 *         description: Marca creada exitosamente
 *       400:
 *         description: Errores de validación
 *       409:
 *         description: La marca ya existe
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
 *           example: 1
 *     responses:
 *       200:
 *         description: Marca encontrada
 *       404:
 *         description: Marca no encontrada
 *   put:
 *     summary: Actualizar marca
 *     tags: [Marcas]
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
 *               nombre_marca:
 *                 type: string
 *                 example: "Samsung Electronics"
 *               pais_origen:
 *                 type: string
 *                 example: "Corea del Sur"
 *               estado:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Marca actualizada
 *       400:
 *         description: Errores de validación
 *       404:
 *         description: Marca no encontrada
 *       409:
 *         description: El nombre de marca ya existe en otro registro
 *   delete:
 *     summary: Desactivar marca (soft delete)
 *     tags: [Marcas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Marca desactivada correctamente
 *       400:
 *         description: Marca ya desactivada o tiene equipos asociados
 *       404:
 *         description: Marca no encontrada
 */
const express = require('express');
const controller = require('../controllers/marcasController');
const { validarMarca, validarId } = require('../middlewares/validaciones');
const router = express.Router();

router.get('/', controller.ObtenerTodos);
router.get('/:id', validarId, controller.ObtenerPorId);
router.post('/', validarMarca, controller.Crear);
router.put('/:id', validarId, validarMarca, controller.Actualizar);
router.delete('/:id', validarId, controller.remover);

module.exports = router;
