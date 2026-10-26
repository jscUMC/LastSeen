const investigaciones = require('../../persistencia/repositorios/InvestigacionRepositorio');
const evidencias = require('../../persistencia/repositorios/EvidenciaRepositorio');
const ranking = require('../../persistencia/repositorios/RankingRepositorio');

const InvestigacionFacade = require('../../aplicacion/facade/InvestigacionFacade');

const investigacionFacade = new InvestigacionFacade();

const finalizarInvestigacion = (req, res) => {
    const id = Number(req.params.investigacionId);

    const resultado = investigacionFacade.finalizarInvestigacion(id);

    if (!resultado.exito) {
        return res.status(resultado.codigo).json({
            mensaje: resultado.mensaje
        });
    }
    
    return res.status(200).json({
        mensaje: 'Investigación ha sido finalizada correctamente',
        investigacion: resultado.investigacion.toJSON()
    });
};

module.exports = {
    finalizarInvestigacion
};