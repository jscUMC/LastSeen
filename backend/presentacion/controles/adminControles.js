const crypto = require('crypto');

const { ADMIN_USUARIO } = require('../../configuracion/variablesEntorno');
const investigaciones = require('../../persistencia/repositorios/InvestigacionRepositorio');
const evidencias = require('../../persistencia/repositorios/EvidenciaRepositorio');
const acertijos = require('../../persistencia/repositorios/AcertijoRepositorio');
const pistas = require('../../persistencia/repositorios/PistaRepositorio');

// Compara con el usuario del administrador sin revelar por el tiempo de respuesta cuántos caracteres acertó
const huella = texto => crypto.createHash('sha256').update(String(texto)).digest();

const esAdministrador = nombre =>
    typeof nombre === 'string' &&
    crypto.timingSafeEqual(huella(nombre.trim()), huella(ADMIN_USUARIO));

// Protege todas las rutas /api/admin: el panel envía el usuario en la cabecera x-admin-usuario
const verificarAdministrador = (req, res, next) => {
    let usuario = '';
    try {
        usuario = decodeURIComponent(req.get('x-admin-usuario') || '');
    } catch {
        usuario = '';
    }

    if (!esAdministrador(usuario)) {
        return res.status(401).json({ mensaje: 'Acceso solo para el administrador' });
    }
    next();
};

const obtenerInvestigaciones = async (req, res) => {
    const [lista, totalAcertijos] = await Promise.all([
        investigaciones.listarTodas(),
        acertijos.contar()
    ]);

    res.status(200).json({
        mensaje: 'Investigaciones obtenidas correctamente',
        totalAcertijos,
        investigaciones: lista
    });
};

// Catálogo completo (incluye lo que el jugador aún no ha desbloqueado)
const obtenerEvidencias = async (req, res) => {
    const [catalogo, listaAcertijos] = await Promise.all([
        evidencias.obtenerTodas(),
        acertijos.obtenerTodos()
    ]);
    const codigoAcertijo = id => (listaAcertijos.find(a => a.id === id) || {}).codigo || null;

    res.status(200).json({
        mensaje: 'Evidencias obtenidas correctamente',
        evidencias: catalogo.map(evidencia => ({
            ...evidencia,
            acertijo: codigoAcertijo(evidencia.acertijoId),
            desbloqueadaPorCodigo: codigoAcertijo(evidencia.desbloqueadaPor)
        }))
    });
};

// Acertijos con sus respuestas aceptadas y las evidencias que plantean y desbloquean
const obtenerAcertijos = async (req, res) => {
    const [listaAcertijos, catalogo] = await Promise.all([
        acertijos.obtenerTodos(),
        evidencias.obtenerTodas()
    ]);

    res.status(200).json({
        mensaje: 'Acertijos obtenidos correctamente',
        acertijos: listaAcertijos.map(acertijo => ({
            ...acertijo,
            evidencia: (catalogo.find(e => e.id === acertijo.evidenciaId) || {}).codigo || null,
            desbloquea: catalogo
                .filter(e => e.desbloqueadaPor === acertijo.id)
                .map(e => e.codigo)
        }))
    });
};

const obtenerPistas = async (req, res) => {
    res.status(200).json({
        mensaje: 'Pistas obtenidas correctamente',
        pistas: await pistas.obtenerTodas()
    });
};

module.exports = {
    esAdministrador,
    verificarAdministrador,
    obtenerInvestigaciones,
    obtenerEvidencias,
    obtenerAcertijos,
    obtenerPistas
};
