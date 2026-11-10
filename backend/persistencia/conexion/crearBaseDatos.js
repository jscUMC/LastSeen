// Monta la base de datos de Last Seen:
//   npm run db:crear      → crea la base (si no existe), las tablas (si no existen) y carga el expediente
//   npm run db:reiniciar  → borra TODAS las tablas y partidas y vuelve a crearlas
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const { BASE_DATOS } = require('../../configuracion/variablesEntorno');

const reiniciar = process.argv.includes('--reiniciar');
const leerSql = archivo => fs.readFileSync(path.join(__dirname, archivo), 'utf8');

async function crearBaseSiNoExiste() {
    // Se conecta a la base "postgres" (siempre existe) para poder crear la del proyecto
    const cliente = new Client({ ...BASE_DATOS, database: 'postgres' });
    await cliente.connect();
    try {
        const { rowCount } = await cliente.query(
            'SELECT 1 FROM pg_database WHERE datname = $1', [BASE_DATOS.database]
        );
        if (rowCount === 0) {
            // El nombre no admite parámetros ($1) en CREATE DATABASE; se cita como identificador
            await cliente.query(`CREATE DATABASE "${BASE_DATOS.database.replace(/"/g, '""')}"`);
            console.log(`✔ Base de datos "${BASE_DATOS.database}" creada`);
        } else {
            console.log(`✔ La base de datos "${BASE_DATOS.database}" ya existe`);
        }
    } finally {
        await cliente.end();
    }
}

async function crearTablasYDatos() {
    const cliente = new Client(BASE_DATOS);
    await cliente.connect();
    try {
        if (reiniciar) {
            await cliente.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
            console.log('✔ Tablas anteriores eliminadas');
        }

        const { rows } = await cliente.query("SELECT to_regclass('public.investigacion') AS tabla");
        if (rows[0].tabla === null) {
            await cliente.query(leerSql('esquema.sql'));
            console.log('✔ Tablas y vista de ranking creadas');
        } else {
            console.log('✔ Las tablas ya existen (usa npm run db:reiniciar para recrearlas)');
        }

        await cliente.query(leerSql('datos.sql'));
        console.log('✔ Expediente 001 cargado (evidencias, acertijos, respuestas, pistas y personas)');
    } finally {
        await cliente.end();
    }
}

(async () => {
    try {
        console.log(`Conectando a PostgreSQL en ${BASE_DATOS.host}:${BASE_DATOS.port} como "${BASE_DATOS.user}"...`);
        await crearBaseSiNoExiste();
        await crearTablasYDatos();
        console.log('Listo. Ahora ejecuta: npm start');
    } catch (error) {
        console.error('✘ No se pudo montar la base de datos:', error.message);
        console.error('  Revisa que PostgreSQL esté encendido y que los datos de backend/.env sean correctos.');
        process.exit(1);
    }
})();
