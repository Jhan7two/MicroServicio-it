const express = require('express');
const router = express.Router();

router.use('/clientes', require('./clientes'));
router.use('/personal', require('./personal'));
router.use('/marcas', require('./marcas'));
router.use('/modelos', require('./modelos'));
router.use('/equipos', require('./equipos'));
router.use('/ordenes_servicio', require('./ordenes'));
router.use('/diagnosticos', require('./diagnosticos'));

module.exports = router;
