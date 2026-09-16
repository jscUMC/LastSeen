const acertijos = require('../datos/acertijos');
const evidencias = require('../datos/evidencias');
const intentos = require('../datos/intentos');

const resolverAcertijo = (req, res) => {

    const { investigacionId, acertijoId } = req.params;
    const { respuesta } = req.body;

    const acertijo = acertijos.find(
        acertijo =>
            acertijo.id === Number(acertijoId) &&
            acertijo.investigacionId === Number(investigacionId)
    );

    if (!acertijo) {
        return res.status(404).json({
            mensaje: 'Acertijo no encontrado'
        });
    }

    if (!respuesta || !respuesta.trim()) {
        return res.status(400).json({
            mensaje: 'La respuesta es obligatoria'
        });
    }

    const respuestaCorrecta =
        respuesta.trim().toLowerCase() ===
        acertijo.respuesta.trim().toLowerCase();

    // Registrar el intento
    const nuevoIntento = {
        id: intentos.length + 1,
        investigacionId: Number(investigacionId),
        acertijoId: Number(acertijoId),
        respuesta: respuesta,
        correcta: respuestaCorrecta,
        fecha: new Date()
    };

    intentos.push(nuevoIntento);

    // Si la respuesta es incorrecta
    if (!respuestaCorrecta) {
        return res.status(400).json({
            mensaje: 'Respuesta incorrecta',
            intento: nuevoIntento
        });
    }

    // Si la respuesta es correcta
    acertijo.resuelto = true;

    const evidencia = evidencias.find(
        evidencia => evidencia.id === acertijo.evidenciaId
    );

    if (evidencia) {
        evidencia.desbloqueada = true;
    }

    res.status(200).json({
        mensaje: 'Respuesta correcta. Evidencia desbloqueada.',
        intento: nuevoIntento,
        acertijo: acertijo,
        evidencia: evidencia
    });
};

module.exports = {
    resolverAcertijo
};