// Intentos de respuesta de cada jugador.
const pool = require('../conexion/database');

const COLUMNAS = `id, investigacion_id AS "investigacionId", acertijo_id AS "acertijoId",
                  respuesta, correcta, fecha`;

async function registrar(investigacionId, acertijoId, respuesta, correcta) {
    const { rows } = await pool.query(
        `INSERT INTO intento (investigacion_id, acertijo_id, respuesta, correcta)
         VALUES ($1, $2, $3, $4) RETURNING ${COLUMNAS}`,
        [investigacionId, acertijoId, respuesta, correcta]
    );
    return rows[0];
}

async function obtenerPorAcertijo(investigacionId, acertijoId) {
    const { rows } = await pool.query(
        `SELECT ${COLUMNAS} FROM intento
         WHERE investigacion_id = $1 AND acertijo_id = $2 ORDER BY fecha, id`,
        [investigacionId, acertijoId]
    );
    return rows;
}

async function contarPorInvestigacion(investigacionId) {
    const { rows } = await pool.query(
        'SELECT COUNT(*) AS total FROM intento WHERE investigacion_id = $1',
        [investigacionId]
    );
    return rows[0].total;
}

module.exports = {
    registrar,
    obtenerPorAcertijo,
    contarPorInvestigacion
};
