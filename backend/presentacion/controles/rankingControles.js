const ranking = require('../../persistencia/repositorios/RankingRepositorio');

const obtenerRanking = async (req, res) => {
    // La vista ya entrega el top 10 ordenado por menor tiempo
    const rankingOrdenado = await ranking.obtenerTop10();

    res.status(200).json({
        mensaje: 'Ranking obtenido correctamente',
        ranking: rankingOrdenado
    });
};

module.exports = {
    obtenerRanking
};