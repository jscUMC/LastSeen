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

// Todas las pistas del expediente con cuántas veces las han pedido (panel del administrador)
async function obtenerTodas() {
    const { rows } = await pool.query(`
        SELECT p.id, p.acertijo_id AS "acertijoId", a.codigo || ' · ' || a.titulo AS acertijo,
               p.orden, p.descripcion, COUNT(pu.id) AS usos
        FROM pista p
        JOIN acertijo a ON a.id = p.acertijo_id
        LEFT JOIN pista_usada pu ON pu.pista_id = p.id
        GROUP BY p.id, a.codigo, a.titulo
        ORDER BY p.acertijo_id, p.orden
    `);
    return rows;
}

module.exports = {
    obtenerPorAcertijo,
    obtenerTodas
};
