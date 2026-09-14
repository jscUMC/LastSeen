//aqui definimos el modelo de investigacion, que es una clase que tiene un constructor
//que recibe los parametros que se van a usar cada vez que un usuario inicie la  investigacion 

class Investigacion {
    constructor(id, nombreUsuario) {
        this.id = id;
        this.nombreUsuario = nombreUsuario;
        this.fechaInicio = new Date();
        this.fechaFin = null;
        this.estado = 'EN_PROGRESO';
        this.tiempoTotal = null;
    }
}

module.exports = Investigacion;