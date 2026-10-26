const acertijos = require('../datos/acertijos');
const evidencias = require('../datos/evidencias');
const intentos = require('../datos/intentos');

const ValidadorRespuesta =
    require('../strategy/ValidadorRespuesta');

const ValidacionIgnorandoMayusculas =
    require('../strategy/ValidacionIgnorandoMayusculas');


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
}


module.exports = InvestigacionFacade;