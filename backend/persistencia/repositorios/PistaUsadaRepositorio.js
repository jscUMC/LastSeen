// Pistas que cada jugador ha solicitado.
const pool = require('../conexion/database');

const COLUMNAS = `id, investigacion_id AS "investigacionId", acertijo_id AS "acertijoId",
                  pista_id AS "pistaId", fecha`;

async function registrar(investigacionId, acertijoId, pistaId) {
    const { rows } = await pool.query(
        `INSERT INTO pista_usada (investigacion_id, acertijo_id, pista_id)
         VALUES ($1, $2, $3) RETURNING ${COLUMNAS}`,
        [investigacionId, acertijoId, pistaId]
    );
    return rows[0];
}

async function contarPorAcertijo(investigacionId, acertijoId) {
    const { rows } = await pool.query(
        'SELECT COUNT(*) AS total FROM pista_usada WHERE investigacion_id = $1 AND acertijo_id = $2',
        [investigacionId, acertijoId]
    );
    return rows[0].total;
}

async function contarPorInvestigacion(investigacionId) {
    const { rows } = await pool.query(
        'SELECT COUNT(*) AS total FROM pista_usada WHERE investigacion_id = $1',
        [investigacionId]
    );
    return rows[0].total;
}

// Registro de pistas con su texto y el acertijo al que pertenecen
async function obtenerPorInvestigacion(investigacionId) {
    const { rows } = await pool.query(
        `SELECT pu.id, pu.investigacion_id AS "investigacionId", pu.acertijo_id AS "acertijoId",
                pu.pista_id AS "pistaId", pu.fecha,
                a.codigo || ' · ' || a.titulo AS acertijo,
                p.descripcion
         FROM pista_usada pu
         JOIN pista p ON p.id = pu.pista_id
         JOIN acertijo a ON a.id = pu.acertijo_id
         WHERE pu.investigacion_id = $1
         ORDER BY pu.fecha, pu.id`,
        [investigacionId]
    );
    return rows;
}

module.exports = {
    registrar,
    contarPorAcertijo,
    contarPorInvestigacion,
    obtenerPorInvestigacion
};
