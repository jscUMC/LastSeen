const investigaciones = require('../../persistencia/repositorios/InvestigacionRepositorio');
const evidencias = require('../../persistencia/repositorios/EvidenciaRepositorio');
const acertijos = require('../../persistencia/repositorios/AcertijoRepositorio');
const intentos = require('../../persistencia/repositorios/IntentoRepositorio');
const pistasUsadas = require('../../persistencia/repositorios/PistaUsadaRepositorio');
const progresos = require('../../persistencia/repositorios/ProgresoRepositorio');

const InvestigacionFacade = require('../../aplicacion/facade/InvestigacionFacade');

const investigacionFacade = new InvestigacionFacade();

const guardarProgreso = async (req, res) => {

    const { investigacionId } = req.params;

    // Buscar la investigación
    const investigacion = await investigaciones.buscarPorId(investigacionId);

    if (!investigacion) {
        return res.status(404).json({
            mensaje: 'Investigación no encontrada'
        });
    }

    const id = investigacion.id;

    // Contar progreso (el catálogo es común; lo desbloqueado es de este jugador)
    const [desbloqueadas, catalogo, totalAcertijos, intentosRealizados, pistasUtilizadas] =
        await Promise.all([
            investigacionFacade.evidenciasDesbloqueadas(investigacion),
            evidencias.obtenerTodas(),
            acertijos.contar(),
            intentos.contarPorInvestigacion(id),
            pistasUsadas.contarPorInvestigacion(id)
        ]);

    const acertijosResueltos =
        investigacion.acertijosResueltos.length;

    const porcentajeCompletado =
        Math.round((acertijosResueltos / Math.max(totalAcertijos, 1)) * 100);

    const progreso = await progresos.guardar({
        investigacionId: id,
        estado: investigacion.obtenerEstado(),
        evidenciasDesbloqueadas: desbloqueadas.length,
        evidenciasTotales: catalogo.length,
        acertijosResueltos,
        acertijosTotales: totalAcertijos,
        intentosRealizados,
        pistasUtilizadas,
        tiempoInvestigacion: investigacion.obtenerTiempoTranscurrido(),
        porcentajeCompletado
    });

    res.status(200).json({
        mensaje: 'Progreso guardado correctamente',
        progreso
    });
};


const obtenerProgreso = async (req, res) => {

    const { investigacionId } = req.params;

    const progreso = await progresos.buscarPorInvestigacion(investigacionId);

    if (!progreso) {
        return res.status(404).json({
            mensaje: 'No existe progreso guardado para esta investigación'
        });
    }

    res.status(200).json({
        mensaje: 'Progreso obtenido correctamente',
        progreso
    });
};


module.exports = {
    guardarProgreso,
    obtenerProgreso
};