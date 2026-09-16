const express = require('express');
const cors = require('cors');

const investigacionRoutes = require('../rutas/investigacionRutas');
const evidenciaRoutes = require('../rutas/evidenciaRutas');
const acertijoRoutes = require('../rutas/acertijoRutas');
const finalizarInvestigacionRoutes = require('../rutas/finalizarInvestigacionRutas');
const rankingRoutes = require('../rutas/rankingRutas');
const intentoRoutes = require('../rutas/intentoRutas');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/investigaciones', investigacionRoutes);
app.use('/api/investigaciones', evidenciaRoutes);
app.use('/api/investigaciones', acertijoRoutes);
app.use('/api/investigaciones', finalizarInvestigacionRoutes);
app.use('/api/ranking', rankingRoutes);
app.use('/api/investigaciones', intentoRoutes);

app.listen(3000, () => {
    console.log('Servidor ejecutándose en http://localhost:3000');
});