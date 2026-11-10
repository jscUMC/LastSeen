// Ranking: vista "ranking" (top 10 de investigaciones finalizadas por menor tiempo).
const pool = require('../conexion/database');

async function obtenerTop10() {
    const { rows } = await pool.query(
        'SELECT nombre_usuario AS "nombreUsuario", tiempo_total AS "tiempoTotal" FROM ranking'
    );
    return rows;
}

module.exports = {
    obtenerTop10
};
