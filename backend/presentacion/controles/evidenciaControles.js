const InvestigacionFacade = require('../../aplicacion/facade/InvestigacionFacade');

const investigacionFacade = new InvestigacionFacade();

const obtenerEvidencias = async (req, res) => {
    const { investigacionId } = req.params;

    const { codigo, ...datos } =
        await investigacionFacade.obtenerEvidencias(investigacionId);

    res.status(codigo).json(datos);
};

module.exports = {
    obtenerEvidencias
};