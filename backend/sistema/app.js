const express = require('express');
const cors = require('cors');

const investigacionRoutes = require('../presentacion/rutas/investigacionRutas');
const evidenciaRoutes = require('../presentacion/rutas/evidenciaRutas');
const acertijoRoutes = require('../presentacion/rutas/acertijoRutas');
const finalizarInvestigacionRoutes = require('../presentacion/rutas/finalizarInvestigacionRutas');
const rankingRoutes = require('../presentacion/rutas/rankingRutas');
const intentoRoutes = require('../presentacion/rutas/intentoRutas');
const pistaRoutes = require('../presentacion/rutas/pistaRutas');
const pistaUsoRoutes = require('../presentacion/rutas/pistaUsoRutas');
const progresoRoutes =require('../presentacion/rutas/progresoRutas');
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

app.listen(3000, () => {
    console.log('Servidor ejecutándose en http://localhost:3000');
});