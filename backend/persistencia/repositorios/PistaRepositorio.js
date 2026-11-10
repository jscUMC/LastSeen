// Pistas del EXPEDIENTE 001: dos por acertijo, en orden
// (la tercera solicitud revela la respuesta: regla HU-04 en pistaControles).
const pool = require('../conexion/database');

async function obtenerPorAcertijo(acertijoId) {
    const { rows } = await pool.query(
        `SELECT id, acertijo_id AS "acertijoId", descripcion
         FROM pista WHERE acertijo_id = $1 ORDER BY orden`,
        [acertijoId]
    );
    return rows;
}

module.exports = {
    obtenerPorAcertijo
};
