const express = require('express');

const router = express.Router();

const {
    resolverAcertijo
} = require('../controles/acertijoControles');

router.post(
    '/:investigacionId/acertijos/:acertijoId/resolver',
    resolverAcertijo
);

module.exports = router;