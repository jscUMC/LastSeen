const acertijos = require('../../persistencia/repositorios/AcertijoRepositorio');
const evidencias = require('../../persistencia/repositorios/EvidenciaRepositorio');
const intentos = require('../../persistencia/repositorios/IntentoRepositorio');

const investigaciones = require('../../persistencia/repositorios/InvestigacionRepositorio');

const ValidadorRespuesta =
    require('../../dominio/strategy/ValidadorRespuesta');

const ValidacionNormalizada =
    require('../../dominio/strategy/ValidacionNormalizada');


class InvestigacionFacade {

    constructor() {
        // Strategy: las respuestas del expediente aceptan tildes, formatos de fecha
        // y variantes (antes: ValidacionIgnorandoMayusculas).
        this.validadorRespuesta = new ValidadorRespuesta(
            new ValidacionNormalizada()
        );
    }

    buscarInvestigacion(investigacionId) {
        return investigaciones.buscarPorId(investigacionId);
    }

    estaDesbloqueada(evidencia, investigacion) {
        return evidencia.desbloqueadaPor === null ||
            investigacion.haResuelto(evidencia.desbloqueadaPor);
    }

    // Evidencias visibles para un jugador: las iniciales y las reveladas por sus acertijos.
    async evidenciasDesbloqueadas(investigacion) {
        const [catalogo, listaAcertijos] = await Promise.all([
            evidencias.obtenerTodas(),
            acertijos.obtenerTodos()
        ]);

        return catalogo
            .filter(evidencia => this.estaDesbloqueada(evidencia, investigacion))
            .map(evidencia => this.vistaEvidencia(evidencia, investigacion, listaAcertijos));
    }

    // Nunca se envía la respuesta del acertijo al cliente.
    vistaEvidencia(evidencia, investigacion, listaAcertijos) {
        const acertijo = listaAcertijos.find(a => a.id === evidencia.acertijoId);

        return {
            ...evidencia,
            desbloqueada: true,
            acertijoPendiente: Boolean(acertijo) && !investigacion.haResuelto(acertijo.id),
            acertijo: acertijo ? {
                id: acertijo.id,
                codigo: acertijo.codigo,
                titulo: acertijo.titulo,
                pregunta: acertijo.pregunta,
                resuelto: investigacion.haResuelto(acertijo.id)
            } : null
        };
    }

    async obtenerEvidencias(investigacionId) {
        const investigacion = await this.buscarInvestigacion(investigacionId);

        if (!investigacion) {
            return {
                exito: false,
                codigo: 404,
                mensaje: 'Investigación no encontrada'
            };
        }

        return {
            exito: true,
            codigo: 200,
            mensaje: 'Evidencias obtenidas correctamente',
            evidencias: await this.evidenciasDesbloqueadas(investigacion)
        };
    }

    async resolverAcertijo(investigacionId, acertijoId, respuesta) {

        const investigacion = await this.buscarInvestigacion(investigacionId);

        if (!investigacion) {
            return {
                exito: false,
                codigo: 404,
                mensaje: 'Investigación no encontrada'
            };
        }

        const acertijo = await acertijos.buscarPorId(acertijoId);

        if (!acertijo) {
            return {
                exito: false,
                codigo: 404,
                mensaje: 'Acertijo no encontrado'
            };
        }

        // State: una investigación finalizada no admite más respuestas
        if (!investigacion.puedeContinuar()) {
            return {
                exito: false,
                codigo: 400,
                mensaje: 'La investigación ya fue finalizada'
            };
        }

        // El acertijo solo existe para el jugador si ya ve la evidencia que lo plantea
        const catalogo = await evidencias.obtenerTodas();
        const evidenciaOrigen = catalogo.find(e => e.id === acertijo.evidenciaId);

        if (!evidenciaOrigen || !this.estaDesbloqueada(evidenciaOrigen, investigacion)) {
            return {
                exito: false,
                codigo: 403,
                mensaje: 'Aún no has encontrado la evidencia de este acertijo'
            };
        }

        if (investigacion.haResuelto(acertijo.id)) {
            return {
                exito: false,
                codigo: 400,
                mensaje: 'Este acertijo ya fue resuelto'
            };
        }

        if (typeof respuesta !== 'string' || !respuesta.trim()) {
            return {
                exito: false,
                codigo: 400,
                mensaje: 'La respuesta es obligatoria'
            };
        }

        const correcta =
            this.validadorRespuesta.validar(
                respuesta,
                acertijo.respuesta
            );

        const nuevoIntento = await intentos.registrar(
            investigacion.id,
            acertijo.id,
            respuesta.trim().slice(0, 200),
            correcta
        );

        if (!correcta) {
            return {
                exito: false,
                codigo: 400,
                mensaje: 'Respuesta incorrecta',
                intento: nuevoIntento
            };
        }

        investigacion.registrarAcertijoResuelto(acertijo.id);
        await investigaciones.registrarAcertijoResuelto(investigacion.id, acertijo.id);

        const listaAcertijos = await acertijos.obtenerTodos();
        const nuevasEvidencias = catalogo
            .filter(evidencia => evidencia.desbloqueadaPor === acertijo.id)
            .map(evidencia => this.vistaEvidencia(evidencia, investigacion, listaAcertijos));

        return {
            exito: true,
            codigo: 200,
            mensaje: nuevasEvidencias.length > 0
                ? `Respuesta correcta. ${nuevasEvidencias.length} evidencia(s) desbloqueada(s).`
                : 'Respuesta correcta. Todas las piezas están sobre el tablero.',
            intento: nuevoIntento,
            acertijo: { id: acertijo.id, codigo: acertijo.codigo, titulo: acertijo.titulo },
            evidencias: nuevasEvidencias,
            investigacionCompleta: investigacion.acertijosResueltos.length === listaAcertijos.length
        };
    }

    async finalizarInvestigacion(investigacionId) {
        const investigacion = await this.buscarInvestigacion(investigacionId);

        if (!investigacion) {
            return{
                exito: false,
                codigo: 404,
                mensaje: 'Investigación a finalizar no encontrada'
            };
        }

        if (!investigacion.puedeContinuar()) {

            return {
                exito: false,
                codigo: 400,
                mensaje: 'La investigación ya fue finalizada'
            };
        }

        const pendientes = (await acertijos.contar()) - investigacion.acertijosResueltos.length;

        if (pendientes > 0) {
            return {
                exito: false,
                codigo: 400,
                mensaje: `Aún quedan ${pendientes} acertijo(s) por resolver`
            };
        }

        const finalizada =
            investigacion.finalizar() &&
            await investigaciones.guardarFinalizacion(investigacion);

        if (!finalizada) {

            return {
                exito: false,
                codigo: 400,
                mensaje: 'No se puede finalizar la investigación'
            };
        }

        // El ranking es una vista sobre las investigaciones finalizadas: no hay que registrarlo aparte

        return {
            exito: true,
            codigo: 200,
            mensaje: 'Investigación finalizada correctamente',
            investigacion: investigacion
        };
    }
}


module.exports = InvestigacionFacade;