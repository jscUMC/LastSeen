//aqui definimos el modelo de investigacion, que es una clase que tiene un constructor
//que recibe los parametros que se van a usar cada vez que un usuario inicie la  investigacion 

const InvestigacionEnProgreso = require('../state/InvestigacionEnProgreso');

class Investigacion {

    constructor(id, nombreUsuario) {
        this.id = id;
        this.nombreUsuario = nombreUsuario;

        this.fechaInicio = new Date();
        this.fechaFinalizacion = null;
        this.tiempoUtilizado = null;

        // Progreso propio de este jugador en el expediente
        this.acertijosResueltos = [];

        this.estado = new InvestigacionEnProgreso(this);
    }

    registrarAcertijoResuelto(acertijoId) {
        if (!this.haResuelto(acertijoId)) {
            this.acertijosResueltos.push(acertijoId);
        }
    }

    haResuelto(acertijoId) {
        return this.acertijosResueltos.includes(acertijoId);
    }

    obtenerTiempoTranscurrido() {
        if (this.tiempoUtilizado !== null) {
            return this.tiempoUtilizado;
        }
        return Date.now() - new Date(this.fechaInicio).getTime();
    }

    cambiarEstado(nuevoEstado) {
        this.estado = nuevoEstado;
    }

    finalizar() {
        return this.estado.finalizar();
    }

    puedeContinuar() {
        return this.estado.puedeContinuar();
    }

    obtenerEstado() {
        return this.estado.obtenerNombre();
    }

    // Funcion para convertir la investigación a un objeto JSON
    // Esto es util para los datos
    toJSON() {
        return {
            id: this.id,
            nombreUsuario: this.nombreUsuario,
            fechaInicio: this.fechaInicio,
            fechaFinalizacion: this.fechaFinalizacion,
            tiempoUtilizado: this.tiempoUtilizado,
            tiempoTranscurrido: this.obtenerTiempoTranscurrido(),
            acertijosResueltos: this.acertijosResueltos,
            estado: this.obtenerEstado()
        };
    }
}

module.exports = Investigacion;