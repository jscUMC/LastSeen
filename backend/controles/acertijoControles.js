const acertijos = require('../datos/acertijos');
const evidencias = require('../datos/evidencias');

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

    if (!respuesta) {
        return res.status(400).json({
            mensaje: 'La respuesta es obligatoria'
        });
    }

    if (
        respuesta.trim().toLowerCase() !==
        acertijo.respuesta.trim().toLowerCase()
    ) {
        return res.status(400).json({
            mensaje: 'Respuesta incorrecta'
        });
    }

    acertijo.resuelto = true;

    const evidencia = evidencias.find(
        evidencia => evidencia.id === acertijo.evidenciaId
    );

    if (evidencia) {
        evidencia.desbloqueada = true;
    }

    res.status(200).json({
        mensaje: 'Respuesta correcta. Evidencia desbloqueada.',
        acertijo: acertijo,
        evidencia: evidencia
    });
};

module.exports = {
    resolverAcertijo
};