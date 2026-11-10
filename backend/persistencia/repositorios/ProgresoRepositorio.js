// Progreso guardado por investigación (una fila por partida, se actualiza en cada guardado).
const pool = require('../conexion/database');

const COLUMNAS = `
    p.investigacion_id AS "investigacionId", p.estado,
    p.evidencias_desbloqueadas AS "evidenciasDesbloqueadas", p.evidencias_totales AS "evidenciasTotales",
    p.acertijos_resueltos AS "acertijosResueltos", p.acertijos_totales AS "acertijosTotales",
    p.intentos_realizados AS "intentosRealizados", p.pistas_utilizadas AS "pistasUtilizadas",
    i.fecha_inicio AS "fechaInicio", p.tiempo_investigacion AS "tiempoInvestigacion",
    p.fecha_guardado AS "fechaGuardado", p.porcentaje_completado AS "porcentajeCompletado"`;

async function guardar(progreso) {
    await pool.query(
        `INSERT INTO progreso (investigacion_id, estado, evidencias_desbloqueadas, evidencias_totales,
             acertijos_resueltos, acertijos_totales, intentos_realizados, pistas_utilizadas,
             tiempo_investigacion, porcentaje_completado, fecha_guardado)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
         ON CONFLICT (investigacion_id) DO UPDATE SET
             estado = EXCLUDED.estado,
             evidencias_desbloqueadas = EXCLUDED.evidencias_desbloqueadas,
             evidencias_totales = EXCLUDED.evidencias_totales,
             acertijos_resueltos = EXCLUDED.acertijos_resueltos,
             acertijos_totales = EXCLUDED.acertijos_totales,
             intentos_realizados = EXCLUDED.intentos_realizados,
             pistas_utilizadas = EXCLUDED.pistas_utilizadas,
             tiempo_investigacion = EXCLUDED.tiempo_investigacion,
             porcentaje_completado = EXCLUDED.porcentaje_completado,
             fecha_guardado = NOW()`,
        [
            progreso.investigacionId, progreso.estado,
            progreso.evidenciasDesbloqueadas, progreso.evidenciasTotales,
            progreso.acertijosResueltos, progreso.acertijosTotales,
            progreso.intentosRealizados, progreso.pistasUtilizadas,
            progreso.tiempoInvestigacion, progreso.porcentajeCompletado
        ]
    );
    return buscarPorInvestigacion(progreso.investigacionId);
}

async function buscarPorInvestigacion(investigacionId) {
    if (!Number.isInteger(Number(investigacionId))) return null;
    const { rows } = await pool.query(
        `SELECT ${COLUMNAS}
         FROM progreso p JOIN investigacion i ON i.id = p.investigacion_id
         WHERE p.investigacion_id = $1`,
        [Number(investigacionId)]
    );
    return rows[0] || null;
}

module.exports = {
    guardar,
    buscarPorInvestigacion
};
