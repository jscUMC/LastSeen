const acertijos = require('../../src/datos/acertijos');
const evidencias = require('../../src/datos/evidencias');
const intentos = require('../../src/datos/intentos');
const ranking = require('../../src/datos/ranking');

const investigaciones = require('../../src/datos/investigaciones');

const ValidadorRespuesta =
    require('../../dominio/strategy/ValidadorRespuesta');

const ValidacionIgnorandoMayusculas =
    require('../../dominio/strategy/ValidacionIgnorandoMayusculas');


class InvestigacionFacade {

    constructor() {
        this.validadorRespuesta = new ValidadorRespuesta(
            new ValidacionIgnorandoMayusculas()
        );
    }

    resolverAcertijo(investigacionId, acertijoId, respuesta) {

        const acertijo = acertijos.find(
            acertijo =>
                acertijo.id === Number(acertijoId) &&
                acertijo.investigacionId === Number(investigacionId)
        );

        if (!acertijo) {
            return {
                exito: false,
                codigo: 404,
                mensaje: 'Acertijo no encontrado'
            };
        }

        if (!respuesta || !respuesta.trim()) {
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

        const nuevoIntento = {
            id: intentos.length + 1,
            investigacionId: Number(investigacionId),
            acertijoId: Number(acertijoId),
            respuesta: respuesta,
            correcta: correcta,
            fecha: new Date()
        };

        intentos.push(nuevoIntento);

        if (!correcta) {
            return {
                exito: false,
                codigo: 400,
                mensaje: 'Respuesta incorrecta',
                intento: nuevoIntento
            };
        }

        acertijo.resuelto = true;

        const evidencia = evidencias.find(
            evidencia =>
                evidencia.id === acertijo.evidenciaId
        );

        if (evidencia) {
            evidencia.desbloqueada = true;
        }

        return {
            exito: true,
            codigo: 200,
            mensaje: 'Respuesta correcta. Evidencia desbloqueada.',
            intento: nuevoIntento,
            acertijo: acertijo,
            evidencia: evidencia
        };
    }

    finalizarInvestigacion(investigacionId) {
        const investigacion = investigaciones.find(
            investigacion => investigacion.id === investigacionId
        );

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

        const finalizada = investigacion.finalizar();

        if (!finalizada) {

            return {
                exito: false,
                codigo: 400,
                mensaje: 'No se puede finalizar la investigación'
            };
        }

        ranking.push({
            nombreUsuario: investigacion.nombreUsuario,
            tiempoTotal: investigacion.tiempoUtilizado
        });

        ranking.sort((a, b) =>
            a.tiempoTotal - b.tiempoTotal
        );

        if (ranking.length > 10) {
            ranking.splice(10);
        }

        return {
            exito: true,
            codigo: 200,
            mensaje: 'Investigación finalizada correctamente',
            investigacion: investigacion
        };
    }
}


module.exports = InvestigacionFacade;