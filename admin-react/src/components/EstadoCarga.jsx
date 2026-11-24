import EncabezadoSeccion from './EncabezadoSeccion';

// Lo que muestra una sección mientras carga o si falló la petición
export default function EstadoCarga({ titulo, error }) {
    return (
        <>
            <EncabezadoSeccion titulo={titulo} />
            <p className="p-10 text-center text-neutral-500" role={error ? 'alert' : 'status'}>
                {error
                    ? `No se pudo cargar la información (${error}). Revisa que el servidor y la base de datos estén encendidos.`
                    : 'Cargando…'}
            </p>
        </>
    );
}