const evidencias = require('../../persistencia/repositorios/EvidenciaRepositorio');

const obtenerEvidencias = (req, res) => {

    console.log('EVIDENCIAS:', evidencias);
    console.log('ES ARREGLO:', Array.isArray(evidencias));

    const { investigacionId } = req.params;

    const evidenciasInvestigacion = evidencias.filter(
        evidencia =>
            evidencia.investigacionId === Number(investigacionId)
    );

    res.status(200).json({
        mensaje: 'Evidencias obtenidas correctamente',
        evidencias: evidenciasInvestigacion
    });
};

module.exports = {
    obtenerEvidencias
};