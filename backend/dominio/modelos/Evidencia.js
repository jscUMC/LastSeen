// Forma de las evidencias del catálogo (EvidenciaRepositorio).
// tipo: 'documento' | 'fotografia' | 'audio'
// desbloqueadaPor: id del acertijo que la revela (null = visible desde el inicio).
class Evidencia {
    constructor(
        id,
        codigo,
        tipo,
        titulo,
        contenido,
        archivo,
        acertijoId,
        desbloqueadaPor
    ) {
        this.id = id;
        this.codigo = codigo;
        this.tipo = tipo;
        this.titulo = titulo;
        this.contenido = contenido;
        this.archivo = archivo;
        this.acertijoId = acertijoId;
        this.desbloqueadaPor = desbloqueadaPor;
    }
}

module.exports = Evidencia;