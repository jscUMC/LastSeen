const express = require('express');
const cors = require('cors');

const investigacionRutas = require('./rutas/investigacionRutas');
const evidenciaRutas = require('./rutas/evidenciaRutas');
const acertijoRutas = require('./rutas/acertijoRutas');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/investigaciones', investigacionRutas);
app.use('/api/investigaciones', evidenciaRutas);
app.use('/api/investigaciones', acertijoRutas);


app.listen(3000, () => {
    console.log('Servidor ejecutándose en http://localhost:3000');
});


