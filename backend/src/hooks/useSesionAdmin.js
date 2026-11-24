import { useState } from 'react';
import { pedirAdmin } from '../utils/api';

const CLAVE = 'adminUsuario';

// Sesión del administrador. Vive en sessionStorage: se borra al cerrar la pestaña
// y es la misma que guarda la pantalla de inicio del juego (js/main.js).
export function useSesionAdmin() {
    const [usuario, setUsuario] = useState(() => sessionStorage.getItem(CLAVE));

    // Comprueba el usuario contra el backend antes de guardarlo; lanza NoAutorizadoError si no es válido
    async function iniciar(nombre) {
        await pedirAdmin('/admin/investigaciones', nombre);
        sessionStorage.setItem(CLAVE, nombre);
        setUsuario(nombre);
    }

    function cerrar() {
        sessionStorage.removeItem(CLAVE);
        setUsuario(null);
    }

    return { usuario, iniciar, cerrar };
}
