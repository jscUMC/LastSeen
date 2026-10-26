const investigaciones = require('../../persistencia/repositorios/InvestigacionRepositorio');
const Investigacion = require('../../dominio/modelos/Investigacion');

const iniciarInvestigacion = (req, res) => {
    const { nombreUsuario } = req.body;

    if (!nombreUsuario) {
        return res.status(400).json({
            mensaje: 'El nombre del usuario es obligatorio'
        });
    }

    const nuevaInvestigacion = new Investigacion(investigaciones.length + 1, nombreUsuario);
    investigaciones.push(nuevaInvestigacion);

    res.status(201).json({
        mensaje: 'Investigación iniciada correctamente',
        investigacion: nuevaInvestigacion.toJSON()
    });
};

module.exports = {
    iniciarInvestigacion
};