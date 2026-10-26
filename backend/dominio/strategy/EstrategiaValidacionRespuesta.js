class EstrategiaValidacionRespuesta {

    validar(respuestaUsuario, respuestaCorrecta) {
        throw new Error(
            'La estrategia debe implementar el método validar()'
        );
    }
}

module.exports = EstrategiaValidacionRespuesta;