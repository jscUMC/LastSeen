class ValidadorRespuesta {

    constructor(estrategia) {
        this.estrategia = estrategia;
    }

    validar(respuestaUsuario, respuestaCorrecta) {

        return this.estrategia.validar(
            respuestaUsuario,
            respuestaCorrecta
        );
    }

    cambiarEstrategia(nuevaEstrategia) {

        this.estrategia = nuevaEstrategia;
    }
}

module.exports = ValidadorRespuesta;