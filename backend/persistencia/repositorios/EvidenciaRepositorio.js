// Catálogo de evidencias del EXPEDIENTE 001 (tabla evidencia + persona).
// desbloqueadaPor: acertijo que la revela (null = visible desde el inicio).
// acertijoId: acertijo que se plantea sobre esta evidencia (null = ninguno).
const pool = require('../conexion/database');

async function obtenerTodas() {
    const { rows } = await pool.query(`
        SELECT e.id, e.codigo, e.tipo, e.titulo, e.contenido, e.archivo,
               e.desbloqueada_por, a.id AS acertijo_id,
               p.nombre, p.edad, p.rol
        FROM evidencia e
        LEFT JOIN acertijo a ON a.evidencia_id = e.id
        LEFT JOIN persona p ON p.evidencia_id = e.id
        ORDER BY e.id
    `);

    return rows.map(fila => ({
        id: fila.id,
        codigo: fila.codigo,
        tipo: fila.tipo,
        titulo: fila.titulo,
        contenido: fila.contenido,
        archivo: fila.archivo,
        ...(fila.nombre && { perfil: { nombre: fila.nombre, edad: fila.edad, rol: fila.rol } }),
        acertijoId: fila.acertijo_id,
        desbloqueadaPor: fila.desbloqueada_por
    }));
}

module.exports = {
    obtenerTodas
};
