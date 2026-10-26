const acertijos = require('../../persistencia/repositorios/AcertijoRepositorio');
const pistas = require('../../persistencia/repositorios/PistaRepositorio');
const pistasUsadas = require('../../persistencia/repositorios/PistaUsadaRepositorio');

const solicitarPista = (req, res) => {

    const { investigacionId, acertijoId } = req.params;

    // Buscar el acertijo
    const acertijo = acertijos.find(
        acertijo =>
            acertijo.id === Number(acertijoId) &&
            acertijo.investigacionId === Number(investigacionId)
    );

    if (!acertijo) {
        return res.status(404).json({
            mensaje: 'Acertijo no encontrado'
        });
    }

    // Buscar la pista del acertijo
    const pista = pistas.find(
        pista =>
            pista.acertijoId === Number(acertijoId)
    );

    if (!pista) {
        return res.status(404).json({
            mensaje: 'Pista no encontrada'
        });
    }

    // Registrar que se utilizó la pista
    const nuevoUsoPista = {
        id: pistasUsadas.length + 1,
        investigacionId: Number(investigacionId),
        acertijoId: Number(acertijoId),
        pistaId: pista.id,
        fecha: new Date()
    };

    pistasUsadas.push(nuevoUsoPista);

    // Devolver la pista
    res.status(200).json({
        mensaje: 'Pista obtenida correctamente',
        pista: pista,
        usoPista: nuevoUsoPista
    });
};

module.exports = {
    solicitarPista
};