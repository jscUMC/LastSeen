const EstadoInvestigacion = require('./EstadoInvestigacion');
const InvestigacionFinalizada = require('./InvestigacionFinalizada');

class InvestigacionEnProgreso extends EstadoInvestigacion {

    constructor(investigacion) {
        super(investigacion);
    }

    finalizar() {
        this.investigacion.fechaFinalizacion = new Date();

        const fechaInicio = new Date(this.investigacion.fechaInicio);

        const tiempoMilisegundos =
            this.investigacion.fechaFinalizacion.getTime() -
            fechaInicio.getTime();

        this.investigacion.tiempoUtilizado =
            Math.max(0, tiempoMilisegundos); // Evita negativos ¿?

        this.investigacion.cambiarEstado(
            new InvestigacionFinalizada(this.investigacion)
        );

        return true;
    }

    puedeContinuar() {
        return true;
    }

    obtenerNombre() {
        return 'EN_PROGRESO';
    }
}

module.exports = InvestigacionEnProgreso;