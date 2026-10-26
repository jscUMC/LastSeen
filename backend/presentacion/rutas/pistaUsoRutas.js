const express = require('express');

const router = express.Router();

const {
    obtenerPistasUsadas
} = require('../controles/pistaUsoControles');

router.get(
    '/:investigacionId/pistas-usadas',
    obtenerPistasUsadas
);

module.exports = router;