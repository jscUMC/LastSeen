const EstrategiaValidacionRespuesta =
    require('./EstrategiaValidacionRespuesta');

// Estrategia para respuestas escritas a mano por el jugador:
// ignora mayúsculas, tildes, espacios repetidos y separadores de fecha (- . /),
// y acepta cualquiera de las respuestas de una lista.
class ValidacionNormalizada
    extends EstrategiaValidacionRespuesta {

    normalizar(texto) {
        return String(texto)
            .normalize('NFD')
            .replace(/[̀-ͯ]/g, '')
            .toLowerCase()
            .replace(/[-.]/g, '/')
            .replace(/\s+/g, ' ')
            .trim();
    }

    validar(respuestaUsuario, respuestaCorrecta) {

        if (
            respuestaUsuario === undefined ||
            respuestaUsuario === null ||
            respuestaCorrecta === undefined ||
            respuestaCorrecta === null
        ) {
            return false;
        }

        const aceptadas = Array.isArray(respuestaCorrecta)
            ? respuestaCorrecta
            : [respuestaCorrecta];

        const usuario = this.normalizar(respuestaUsuario);

        return aceptadas.some(
            respuesta => this.normalizar(respuesta) === usuario
        );
    }
}

module.exports = ValidacionNormalizada;