//aqui importamos el arreglo donde se están guardando las investigaciones
const investigaciones = require('../datos/investigaciones');
//aqui importamos el modelo de investigacion, que es una clase que tiene un constructor
const Investigacion = require('../modelos/investigacionModelo');


//(req es la solicitud que hace el usuario y res es la respuesta que se le da al usuario)
const iniciarInvestigacion = (req, res) => {
//obetenemos el nombre del usuario del cuerpo de la solicitud
    const { nombreUsuario } = req.body;

    if (!nombreUsuario) {
        return res.status(400).json({
            mensaje: 'El nombre del usuario es obligatorio'
        });
    }

    const id = investigaciones.length + 1;

    const investigacion = new Investigacion(
        id,
        nombreUsuario
    );

    investigaciones.push(investigacion);

    res.status(201).json({
        mensaje: 'Investigación iniciada correctamente',
        investigacion: investigacion
    });
};
//exportamos la funcion iniciarInvestigacion para que pueda ser usada en otros archivos
module.exports = {
    iniciarInvestigacion
};