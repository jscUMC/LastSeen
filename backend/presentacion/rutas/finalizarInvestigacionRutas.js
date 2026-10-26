const express = require('express');

const router = express.Router();

const {
    finalizarInvestigacion
} = require('../controles/finalizarInvestigacionControles');

router.post(
    '/:investigacionId/finalizar',
    finalizarInvestigacion
);

module.exports = router;