class Evidencia {
    constructor(
        id,
        investigacionId,
        tipo,
        titulo,
        contenido,
        desbloqueada
    ) {
        this.id = id;
        this.investigacionId = investigacionId;
        this.tipo = tipo;
        this.titulo = titulo;
        this.contenido = contenido;
        this.desbloqueada = desbloqueada;
    }
}

module.exports = Evidencia;