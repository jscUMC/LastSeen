const investigaciones = require('../datos/investigaciones');

const iniciarInvestigacion = (req, res) => {
    const { nombreUsuario } = req.body;

    if (!nombreUsuario) {
        return res.status(400).json({
            mensaje: 'El nombre del usuario es obligatorio'
        });
    }

    const nuevaInvestigacion = {
        id: investigaciones.length + 1,
        nombreUsuario,
        fechaInicio: new Date(),
        fechaFinalizacion: null,
        tiempoUtilizado: null,
        finalizada: false
    };

    investigaciones.push(nuevaInvestigacion);

    res.status(201).json({
        mensaje: 'Investigación iniciada correctamente',
        investigacion: nuevaInvestigacion
    });
};

module.exports = {
    iniciarInvestigacion
};