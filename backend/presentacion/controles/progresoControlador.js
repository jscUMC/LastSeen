const investigaciones = require('../../persistencia/repositorios/InvestigacionRepositorio');
const evidencias = require('../../persistencia/repositorios/EvidenciaRepositorio');
const acertijos = require('../../persistencia/repositorios/AcertijoRepositorio');
const intentos = require('../../persistencia/repositorios/IntentoRepositorio');
const pistasUsadas = require('../../persistencia/repositorios/PistaUsadaRepositorio');
const progresos = require('../../persistencia/repositorios/ProgresoRepositorio');

const guardarProgreso = (req, res) => {

    const { investigacionId } = req.params;

    const id = Number(investigacionId);

    // Buscar la investigación
    const investigacion = investigaciones.find(
        investigacion => investigacion.id === id
    );

    if (!investigacion) {
        return res.status(404).json({
            mensaje: 'Investigación no encontrada'
        });
    }

    // Obtener información de la investigación
    const evidenciasInvestigacion = evidencias.filter(
        evidencia =>
            evidencia.investigacionId === id
    );

    const acertijosInvestigacion = acertijos.filter(
        acertijo =>
            acertijo.investigacionId === id
    );

    const intentosInvestigacion = intentos.filter(
        intento =>
            intento.investigacionId === id
    );

    const pistasInvestigacion = pistasUsadas.filter(
        pista =>
            pista.investigacionId === id
    );

    // Contar progreso
    const evidenciasDesbloqueadas =
        evidenciasInvestigacion.filter(
            evidencia => evidencia.desbloqueada === true
        ).length;

    const acertijosResueltos =
        acertijosInvestigacion.filter(
            acertijo => acertijo.resuelto === true
        ).length;

    // Buscar si ya existe un progreso guardado
    const progresoExistente = progresos.find(
        progreso =>
            progreso.investigacionId === id
    );

    const progreso = {
        investigacionId: id,
        estado: investigacion.estado,
        evidenciasDesbloqueadas,
        evidenciasTotales: evidenciasInvestigacion.length,
        acertijosResueltos,
        acertijosTotales: acertijosInvestigacion.length,
        intentosRealizados: intentosInvestigacion.length,
        pistasUtilizadas: pistasInvestigacion.length,
        fechaGuardado: new Date()
    };

    if (progresoExistente) {

        Object.assign(
            progresoExistente,
            progreso
        );

    } else {

        progresos.push(progreso);

    }

    res.status(200).json({
        mensaje: 'Progreso guardado correctamente',
        progreso
    });
};


const obtenerProgreso = (req, res) => {

    const { investigacionId } = req.params;

    const id = Number(investigacionId);

    const progreso = progresos.find(
        progreso =>
            progreso.investigacionId === id
    );

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