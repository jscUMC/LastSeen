const EstrategiaValidacionRespuesta =
    require('./EstrategiaValidacionRespuesta');

class ValidacionIgnorandoMayusculas
    extends EstrategiaValidacionRespuesta {

    validar(respuestaUsuario, respuestaCorrecta) {

        if (
            respuestaUsuario === undefined ||
            respuestaUsuario === null ||
            respuestaCorrecta === undefined ||
            respuestaCorrecta === null
        ) {
            return false;
        }

        return respuestaUsuario.trim().toLowerCase() ===
            respuestaCorrecta.trim().toLowerCase();
    }
}

module.exports = ValidacionIgnorandoMayusculas;