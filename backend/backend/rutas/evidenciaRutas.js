const express = require('express');

const router = express.Router();

const {
    obtenerEvidencias
} = require('../controles/evidenciaControles');

router.get(
    '/:investigacionId/evidencias',
    obtenerEvidencias
);

module.exports = router;