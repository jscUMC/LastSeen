// Clase para representar el estado de una investigación finalizada

const EstadoInvestigacion = require('./EstadoInvestigacion');

class InvestigacionFinalizada extends EstadoInvestigacion {

    constructor(investigacion) {
        super(investigacion);
    }

    finalizar() {
        return false;
    }

    puedeContinuar() {
        return false;
    }

    obtenerNombre() {
        return 'FINALIZADA';
    }
}

module.exports = InvestigacionFinalizada;