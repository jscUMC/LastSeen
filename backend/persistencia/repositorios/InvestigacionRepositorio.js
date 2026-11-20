// Investigaciones (partidas) guardadas en PostgreSQL.
// Convierte las filas en objetos del dominio Investigacion con su estado (patrón State).
const pool = require('../conexion/database');
const Investigacion = require('../../dominio/modelos/Investigacion');
const InvestigacionFinalizada = require('../../dominio/state/InvestigacionFinalizada');

function aDominio(fila, acertijosResueltos) {
    const investigacion = new Investigacion(fila.id, fila.nombre_usuario);
    investigacion.fechaInicio = fila.fecha_inicio;
    investigacion.fechaFinalizacion = fila.fecha_finalizacion;
    investigacion.tiempoUtilizado = fila.tiempo_utilizado;
    investigacion.acertijosResueltos = acertijosResueltos;

    if (fila.estado === 'FINALIZADA') {
        investigacion.cambiarEstado(new InvestigacionFinalizada(investigacion));
    }
    return investigacion;
}

async function crear(nombreUsuario) {
    const { rows } = await pool.query(
        'INSERT INTO investigacion (nombre_usuario) VALUES ($1) RETURNING *',
        [nombreUsuario]
    );
    return aDominio(rows[0], []);
}

async function buscarPorId(id) {
    if (!Number.isInteger(Number(id))) return null;

    const { rows } = await pool.query('SELECT * FROM investigacion WHERE id = $1', [Number(id)]);
    if (rows.length === 0) return null;

    const resueltos = await pool.query(
        'SELECT acertijo_id FROM acertijo_resuelto WHERE investigacion_id = $1 ORDER BY fecha',
        [rows[0].id]
    );
    return aDominio(rows[0], resueltos.rows.map(fila => fila.acertijo_id));
}

async function registrarAcertijoResuelto(investigacionId, acertijoId) {
    await pool.query(
        `INSERT INTO acertijo_resuelto (investigacion_id, acertijo_id)
         VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [investigacionId, acertijoId]
    );
}

// Guarda el cierre calculado por el estado. Devuelve false si ya estaba finalizada
// (evita registrar dos veces el mismo resultado en el ranking).
async function guardarFinalizacion(investigacion) {
    const { rowCount } = await pool.query(
        `UPDATE investigacion
         SET estado = $2, fecha_finalizacion = $3, tiempo_utilizado = $4
         WHERE id = $1 AND estado = 'EN_PROGRESO'`,
        [
            investigacion.id,
            investigacion.obtenerEstado(),
            investigacion.fechaFinalizacion,
            investigacion.tiempoUtilizado
        ]
    );
    return rowCount === 1;
}

// Listado completo para el administrador, con el avance de cada partida.
// shortcut: devuelve todas las filas sin paginar; paginar si llegan a ser miles de partidas.
async function listarTodas() {
    const { rows } = await pool.query(`
        SELECT i.id, i.nombre_usuario AS "nombreUsuario", i.estado,
               i.fecha_inicio AS "fechaInicio", i.fecha_finalizacion AS "fechaFinalizacion",
               i.tiempo_utilizado AS "tiempoUtilizado",
               (SELECT COUNT(*) FROM acertijo_resuelto r WHERE r.investigacion_id = i.id) AS "acertijosResueltos",
               (SELECT COUNT(*) FROM intento t WHERE t.investigacion_id = i.id) AS intentos,
               (SELECT COUNT(*) FROM pista_usada p WHERE p.investigacion_id = i.id) AS "pistasUsadas"
        FROM investigacion i
        ORDER BY i.id DESC
    `);
    return rows;
}

module.exports = {
    crear,
    listarTodas,
    buscarPorId,
    registrarAcertijoResuelto,
    guardarFinalizacion
};
