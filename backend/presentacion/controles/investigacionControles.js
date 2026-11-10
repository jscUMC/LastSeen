const investigaciones = require('../../persistencia/repositorios/InvestigacionRepositorio');

const iniciarInvestigacion = async (req, res) => {
    const { nombreUsuario: nombre } = req.body || {};
    const nombreUsuario = typeof nombre === 'string'
        ? nombre.trim().slice(0, 40)
        : '';

    if (!nombreUsuario) {
        return res.status(400).json({
            mensaje: 'El nombre del usuario es obligatorio'
        });
    }

    const nuevaInvestigacion = await investigaciones.crear(nombreUsuario);

    res.status(201).json({
        mensaje: 'Investigación iniciada correctamente',
        investigacion: nuevaInvestigacion.toJSON()
    });
};

module.exports = {
    iniciarInvestigacion
};