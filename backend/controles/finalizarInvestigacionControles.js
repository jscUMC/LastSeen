const investigaciones = require('../datos/investigaciones');
const evidencias = require('../datos/evidencias');
const ranking = require('../datos/ranking');

const finalizarInvestigacion = (req, res) => {
    const { investigacionId } = req.params;

    const investigacion = investigaciones.find(
        investigacion =>
            investigacion.id === Number(investigacionId)
    );

    if (!investigacion) {
        return res.status(404).json({
            mensaje: 'Investigación no encontrada'
        });
    }

    if (investigacion.estado === 'FINALIZADA') {
        return res.status(400).json({
            mensaje: 'La investigación ya fue finalizada'
        });
    }

    const evidenciasInvestigacion = evidencias.filter(
        evidencia =>
            evidencia.investigacionId === Number(investigacionId)
    );

    if (evidenciasInvestigacion.length === 0) {
        return res.status(400).json({
            mensaje: 'La investigación no tiene evidencias asociadas'
        });
    }

    const investigacionCompleta = evidenciasInvestigacion.every(
        evidencia => evidencia.desbloqueada === true
    );

    if (!investigacionCompleta) {
        return res.status(400).json({
            mensaje: 'La investigación aún no está completa'
        });
    }

    const fechaFin = new Date();

    const tiempoMilisegundos =
        fechaFin - new Date(investigacion.fechaInicio);

    const tiempoTotal = Math.floor(
        tiempoMilisegundos / 1000
    );

    investigacion.fechaFin = fechaFin;
    investigacion.tiempoTotal = tiempoTotal;
    investigacion.estado = 'FINALIZADA';

    const resultadoRanking = {
        posicion: ranking.length + 1,
        investigacionId: investigacion.id,
        nombreUsuario: investigacion.nombreUsuario,
        tiempoTotal: tiempoTotal,
        fechaFin: fechaFin
    };

    ranking.push(resultadoRanking);

    res.status(200).json({
        mensaje: 'Investigación finalizada correctamente',
        investigacion,
        ranking: resultadoRanking
    });
};

module.exports = {
    finalizarInvestigacion
};