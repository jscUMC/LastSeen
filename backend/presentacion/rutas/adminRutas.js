const express = require('express');

const router = express.Router();

const {
    verificarAdministrador,
    obtenerInvestigaciones,
    obtenerEvidencias,
    obtenerAcertijos,
    obtenerPistas
} = require('../controles/adminControles');

// Todas las rutas del panel exigen el usuario del administrador
router.use(verificarAdministrador);

router.get('/investigaciones', obtenerInvestigaciones);
router.get('/evidencias', obtenerEvidencias);
router.get('/acertijos', obtenerAcertijos);
router.get('/pistas', obtenerPistas);

module.exports = router;
