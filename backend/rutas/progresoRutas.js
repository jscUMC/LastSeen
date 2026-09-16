const express = require('express');

const router = express.Router();

const {
    guardarProgreso,
    obtenerProgreso
} = require('../controles/progresoControles');


// Guardar progreso
router.post(
    '/:investigacionId/progreso',
    guardarProgreso
);


// Obtener progreso guardado
router.get(
    '/:investigacionId/progreso',
    obtenerProgreso
);


module.exports = router;