// Variables de entorno de la aplicación.
// Se leen del archivo backend/.env (copiar .env.ejemplo) o de las variables del sistema.
const fs = require('fs');
const path = require('path');

const archivoEnv = path.join(__dirname, '../.env');

// process.loadEnvFile existe desde Node 20.12; en versiones anteriores se usan las variables del sistema
if (fs.existsSync(archivoEnv) && typeof process.loadEnvFile === 'function') {
    process.loadEnvFile(archivoEnv);
}

module.exports = {
    PUERTO: Number(process.env.PORT) || 3000,
    BASE_DATOS: {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'lastseen'
    }
};
