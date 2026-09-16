const express = require('express');

const router = express.Router();

const {
    obtenerIntentos
} = require('../controles/intentoControles');

router.get(
    '/:investigacionId/acertijos/:acertijoId/intentos',
    obtenerIntentos
);

module.exports = router;