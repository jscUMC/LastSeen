const express = require('express');

const rutas = express.Router();
//aqui importamos la funcion iniciarInvestigacion que se encarga de iniciar una investigacion
const {
    iniciarInvestigacion
} = require('../controles/investigacionControles');
//definimos la ruta tipo post, y cuando llegue la peticion 
// se encarga de iniciar la funcion iniciarinvestigacion 
rutas.post('/', iniciarInvestigacion);

module.exports = rutas;//exporta el router para que pueda ser usado en otros archivos