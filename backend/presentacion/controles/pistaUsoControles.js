const pistasUsadas = require('../../persistencia/repositorios/PistaUsadaRepositorio');

const obtenerPistasUsadas = async (req, res) => {
    const { investigacionId } = req.params;

    // Cada uso trae el texto de la pista y el acertijo al que pertenece (JOIN en el repositorio)
    const pistasConTexto = await pistasUsadas.obtenerPorInvestigacion(Number(investigacionId));

    res.status(200).json({
        mensaje: 'Pistas utilizadas obtenidas correctamente',
        pistasUsadas: pistasConTexto
    });
};

module.exports = {
    obtenerPistasUsadas
};