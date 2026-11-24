const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');

const { PUERTO } = require('../configuracion/variablesEntorno');
const pool = require('../persistencia/conexion/database');

const investigacionRoutes = require('../presentacion/rutas/investigacionRutas');
const evidenciaRoutes = require('../presentacion/rutas/evidenciaRutas');
const acertijoRoutes = require('../presentacion/rutas/acertijoRutas');
const finalizarInvestigacionRoutes = require('../presentacion/rutas/finalizarInvestigacionRutas');
const rankingRoutes = require('../presentacion/rutas/rankingRutas');
const intentoRoutes = require('../presentacion/rutas/intentoRutas');
const pistaRoutes = require('../presentacion/rutas/pistaRutas');
const pistaUsoRoutes = require('../presentacion/rutas/pistaUsoRutas');
const progresoRoutes =require('../presentacion/rutas/progresoRutas');
const adminRoutes = require('../presentacion/rutas/adminRutas');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/investigaciones', investigacionRoutes);
app.use('/api/investigaciones', evidenciaRoutes);
app.use('/api/investigaciones', acertijoRoutes);
app.use('/api/investigaciones', finalizarInvestigacionRoutes);
app.use('/api/ranking', rankingRoutes);
app.use('/api/investigaciones', intentoRoutes);
app.use('/api/investigaciones', pistaRoutes);
app.use('/api/investigaciones', pistaUsoRoutes);
app.use('/api/investigaciones', progresoRoutes);
app.use('/api/admin', adminRoutes);

// Sirve el frontend y los recursos del expediente (fotos, PDF, audios) desde el mismo servidor
app.use(express.static(path.join(__dirname, '../../frontend')));

// Panel de administración en React: se compila con "npm run build" dentro de admin-react
const panelAdmin = path.join(__dirname, '../../admin-react/dist');
app.use('/admin', express.static(panelAdmin));

// Express 5 envía aquí los errores de los controles async (p. ej. PostgreSQL apagado)
app.use((error, req, res, next) => {
    // 22P02 = id con formato inválido (p. ej. /api/investigaciones/abc/...)
    if (error.code === '22P02') {
        return res.status(400).json({ mensaje: 'Identificador inválido' });
    }
    console.error(error);
    res.status(500).json({ mensaje: 'Error interno del servidor (revisa la conexión con la base de datos)' });
});

if (require.main === module) {
    app.listen(PUERTO, async () => {
        console.log(`Servidor ejecutándose en http://localhost:${PUERTO}`);
        try {
            await pool.query('SELECT 1 FROM investigacion LIMIT 1');
            console.log('Conectado a PostgreSQL');
            if (!fs.existsSync(panelAdmin)) {
                console.warn('⚠ El panel de administración no está compilado: cd admin-react && npm install && npm run build');
            }
        } catch (error) {
            console.error(`⚠ No se pudo usar la base de datos: ${error.message}`);
            console.error('  Enciende PostgreSQL, revisa backend/.env y ejecuta: npm run db:crear');
        }
    });
}

module.exports = app;