
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const investigacionesRutas = require('./rutas/investigacionRutas');

const evidenciaRoutes = require('./rutas/evidenciaRutas');

app.use('/investigaciones', investigacionesRutas);

app.use('/api/investigaciones', evidenciaRoutes);

app.listen(3000, () => {
    console.log('Servidor ejecutándose en http://localhost:3000');
});
