const InvestigacionFacade =
    require('../facade/InvestigacionFacade');

const investigacionFacade =
    new InvestigacionFacade();


const resolverAcertijo = (req, res) => {

    const { investigacionId, acertijoId } = req.params;
    const { respuesta } = req.body;

    const resultado =
        investigacionFacade.resolverAcertijo(
            investigacionId,
            acertijoId,
            respuesta
        );

    const {
        codigo,
        ...datos
    } = resultado;

    return res.status(codigo).json(datos);
};


module.exports = {
    resolverAcertijo
};