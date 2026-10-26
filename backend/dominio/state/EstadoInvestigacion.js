
class EstadoInvestigacion {
    constructor(investigacion) {
        this.investigacion = investigacion;
    }
    
    finalizar() {
        throw new Error(
            'El estado actual no permite finalizar la investigación'
        );
    }

    puedeContinuar() {
        throw new Error(
            'El estado actual no permite continuar la investigación'
        );
    }

    obtenerNombre() {
        throw new Error(
            'El estado debe definir su nombre'
        );
    }
}

module.exports = EstadoInvestigacion;