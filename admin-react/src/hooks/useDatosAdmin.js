import { useEffect, useState } from 'react';
import { NoAutorizadoError, pedirAdmin } from '../utils/api';

// Carga una ruta de la API del panel y expone { datos, cargando, error }.
// Si el usuario deja de ser válido llama a onNoAutorizado (cierra la sesión).
export function useDatosAdmin(ruta, usuario, onNoAutorizado) {
    const [estado, setEstado] = useState({ datos: null, cargando: true, error: null });

    useEffect(() => {
        let vigente = true; // ignora la respuesta si el componente ya se desmontó (cambio de sección)

        pedirAdmin(ruta, usuario)
            .then(datos => {
                if (vigente) setEstado({ datos, cargando: false, error: null });
            })
            .catch(error => {
                if (!vigente) return;
                if (error instanceof NoAutorizadoError) return onNoAutorizado();
                setEstado({ datos: null, cargando: false, error: error.message });
            });

        return () => { vigente = false; };
        // onNoAutorizado no es dependencia: cambiarlo no debe volver a pedir los datos
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ruta, usuario]);

    return estado;
}
