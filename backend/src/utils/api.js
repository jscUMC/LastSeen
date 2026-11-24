// Error propio para distinguir "usuario de administrador no válido" de un fallo del servidor
export class NoAutorizadoError extends Error {}

// Las rutas /api/admin exigen el usuario del administrador en la cabecera x-admin-usuario
export async function pedirAdmin(ruta, usuario) {
    const respuesta = await fetch(`/api${ruta}`, {
        headers: { 'x-admin-usuario': encodeURIComponent(usuario) }
    });

    if (respuesta.status === 401) {
        throw new NoAutorizadoError('Usuario de administrador no válido');
    }
    if (!respuesta.ok) {
        throw new Error(`El servidor respondió con error ${respuesta.status}`);
    }
    return respuesta.json();
}
