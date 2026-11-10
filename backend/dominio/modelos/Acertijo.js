// Forma de los acertijos del catálogo (AcertijoRepositorio).
// El estado "resuelto" es de cada jugador: vive en Investigacion.acertijosResueltos.
class Acertijo {
    constructor(
        id,
        codigo,
        titulo,
        pregunta,
        respuesta,   // string o lista de respuestas aceptadas
        evidenciaId  // evidencia sobre la que se plantea
    ) {
        this.id = id;
        this.codigo = codigo;
        this.titulo = titulo;
        this.pregunta = pregunta;
        this.respuesta = respuesta;
        this.evidenciaId = evidenciaId;
    }
}

module.exports = Acertijo;