const intentos = require('../datos/intentos');

const obtenerIntentos = (req, res) => {

    const { investigacionId, acertijoId } = req.params;

    const intentosAcertijo = intentos.filter(
        intento =>
            intento.investigacionId === Number(investigacionId) &&
            intento.acertijoId === Number(acertijoId)
    );

    res.status(200).json({
        mensaje: 'Intentos obtenidos correctamente',
        intentos: intentosAcertijo
    });
};

module.exports = {
    obtenerIntentos
};