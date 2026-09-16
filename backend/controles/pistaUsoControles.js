const pistasUsadas = require('../datos/pistasUsadas');

const obtenerPistasUsadas = (req, res) => {

    const { investigacionId } = req.params;

    const usos = pistasUsadas.filter(
        uso =>
            uso.investigacionId === Number(investigacionId)
    );

    res.status(200).json({
        mensaje: 'Pistas utilizadas obtenidas correctamente',
        pistasUsadas: usos
    });
};

module.exports = {
    obtenerPistasUsadas
};