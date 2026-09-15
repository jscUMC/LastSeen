const express = require('express');

const router = express.Router();

const {
    obtenerRanking
} = require('../controles/rankingControles');

router.get('/', obtenerRanking);

module.exports = router;