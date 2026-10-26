const ranking = require('../datos/ranking');

const obtenerRanking = (req, res) => {
    const rankingOrdenado = [...ranking].sort(
        (a, b) => a.tiempoTotal - b.tiempoTotal
    );

    res.status(200).json({
        mensaje: 'Ranking obtenido correctamente',
        ranking: rankingOrdenado
    });
};

module.exports = {
    obtenerRanking
};