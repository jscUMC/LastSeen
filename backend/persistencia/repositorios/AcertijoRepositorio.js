// Acertijos del EXPEDIENTE 001 (tabla acertijo + respuesta_aceptada).
// respuesta: lista de respuestas aceptadas; la primera es la canónica.
const pool = require('../conexion/database');

const CONSULTA = `
    SELECT a.id, a.codigo, a.titulo, a.pregunta, a.evidencia_id,
           ARRAY_AGG(r.respuesta ORDER BY r.orden) AS respuesta
    FROM acertijo a
    JOIN respuesta_aceptada r ON r.acertijo_id = a.id
`;

const aObjeto = fila => ({
    id: fila.id,
    codigo: fila.codigo,
    titulo: fila.titulo,
    pregunta: fila.pregunta,
    evidenciaId: fila.evidencia_id,
    respuesta: fila.respuesta
});

async function obtenerTodos() {
    const { rows } = await pool.query(`${CONSULTA} GROUP BY a.id ORDER BY a.id`);
    return rows.map(aObjeto);
}

async function buscarPorId(id) {
    if (!Number.isInteger(Number(id))) return null;
    const { rows } = await pool.query(`${CONSULTA} WHERE a.id = $1 GROUP BY a.id`, [Number(id)]);
    return rows.length ? aObjeto(rows[0]) : null;
}

async function contar() {
    const { rows } = await pool.query('SELECT COUNT(*) AS total FROM acertijo');
    return rows[0].total;
}

module.exports = {
    obtenerTodos,
    buscarPorId,
    contar
};
