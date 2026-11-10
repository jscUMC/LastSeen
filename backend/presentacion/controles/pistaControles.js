const acertijos = require('../../persistencia/repositorios/AcertijoRepositorio');
const investigaciones = require('../../persistencia/repositorios/InvestigacionRepositorio');
const pistas = require('../../persistencia/repositorios/PistaRepositorio');
const pistasUsadas = require('../../persistencia/repositorios/PistaUsadaRepositorio');

const solicitarPista = async (req, res) => {
    const { investigacionId, acertijoId } = req.params;

    const investigacion = await investigaciones.buscarPorId(investigacionId);

    if (!investigacion) {
        return res.status(404).json({ mensaje: 'Investigación no encontrada' });
    }

    // Los acertijos son del catálogo del expediente (no por investigación)
    const acertijo = await acertijos.buscarPorId(acertijoId);

    if (!acertijo) {
        return res.status(404).json({ mensaje: 'Acertijo no encontrado' });
    }

    if (!investigacion.puedeContinuar()) {
        return res.status(400).json({ mensaje: 'La investigación ya fue finalizada' });
    }

    // 1. Contar cuántas pistas ha usado YA el jugador para este acertijo específico
    const numeroDeUso = await pistasUsadas.contarPorAcertijo(investigacion.id, acertijo.id);

    // 2. REGLA HU-04: Si ya pidió 2 pistas, la tercera le da la respuesta
    if (numeroDeUso >= 2) {
        return res.status(200).json({
            mensaje: 'Límite de pistas alcanzado.',
            pista: { descripcion: `Tus instintos te lo dicen claramente. La respuesta es: "${acertijo.respuesta[0]}"` }
        });
    }

    // 3. Buscar las pistas disponibles para este acertijo
    const pistasDelAcertijo = await pistas.obtenerPorAcertijo(acertijo.id);

    // Obtener la pista 1 o pista 2 según el número de uso
    const pistaCorrespondiente = pistasDelAcertijo[numeroDeUso];

    if (!pistaCorrespondiente) {
        return res.status(404).json({ mensaje: 'No hay más pistas disponibles' });
    }

    // Registrar que se utilizó la pista
    const nuevoUsoPista = await pistasUsadas.registrar(
        investigacion.id,
        acertijo.id,
        pistaCorrespondiente.id
    );

    // Devolver la pista
    res.status(200).json({
        mensaje: 'Pista obtenida correctamente',
        pista: pistaCorrespondiente,
        usoPista: nuevoUsoPista
    });
};

module.exports = { solicitarPista };