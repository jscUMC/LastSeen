// Conexión a PostgreSQL: un único Pool compartido por todos los repositorios.
const { Pool, types } = require('pg');
const { BASE_DATOS } = require('../../configuracion/variablesEntorno');

// BIGINT (tiempos en ms y COUNT) llega como texto por defecto; aquí se convierte a número
types.setTypeParser(types.builtins.INT8, Number);

const pool = new Pool(BASE_DATOS);

module.exports = pool;
