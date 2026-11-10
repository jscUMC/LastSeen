const intentos = require('../../persistencia/repositorios/IntentoRepositorio');

const obtenerIntentos = async (req, res) => {

    const { investigacionId, acertijoId } = req.params;

    const intentosAcertijo = await intentos.obtenerPorAcertijo(
        Number(investigacionId),
        Number(acertijoId)
    );

    res.status(200).json({
        mensaje: 'Intentos obtenidos correctamente',
        intentos: intentosAcertijo
    });
};

module.exports = {
    obtenerIntentos
};