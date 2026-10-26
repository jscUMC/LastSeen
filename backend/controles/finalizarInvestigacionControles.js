const investigaciones = require('../datos/investigaciones');
const evidencias = require('../datos/evidencias');
const ranking = require('../datos/ranking');

const finalizarInvestigacion = (req, res) => {
    const id = parseInt(req.params.id);

    const investigacion = investigaciones.find(
        investigacion => investigacion.id === id
    );

    if (!investigacion) {
        return res.status(404).json({
            mensaje: 'Investigación no encontrada'
        });
    }

    if (!investigacion.puedeContinuar()) {
        return res.status(400).json({
            mensaje: 'La investigación ya fue finalizada'
        });
    }

    const finalizada = investigacion.finalizar();

    if (!finalizada) {
        return res.status(400).json({
            mensaje: 'No se puede finalizar la investigación'
        });
    }
    
    return res.status(200).json({
        mensaje: 'Investigación finalizada correctamente',
        investigacion: investigacion.toJSON()
    });
};

module.exports = {
    finalizarInvestigacion
};