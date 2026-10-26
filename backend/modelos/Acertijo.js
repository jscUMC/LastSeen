class Acertijo {
    constructor(
        id,
        investigacionId,
        pregunta,
        respuesta,
        evidenciaId
    ) {
        this.id = id;
        this.investigacionId = investigacionId;
        this.pregunta = pregunta;
        this.respuesta = respuesta;
        this.evidenciaId = evidenciaId;
        this.resuelto = false;
    }
}

module.exports = Acertijo;