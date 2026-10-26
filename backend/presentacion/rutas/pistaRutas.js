const express = require('express');

const router = express.Router();

const {
    solicitarPista
} = require('../controles/pistaControles');

router.post(
    '/:investigacionId/acertijos/:acertijoId/pista',
    solicitarPista
);

module.exports = router;