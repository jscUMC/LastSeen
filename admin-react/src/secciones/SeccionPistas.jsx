import { useDatosAdmin } from '../hooks/useDatosAdmin';
import EncabezadoSeccion from '../components/EncabezadoSeccion';
import EstadoCarga from '../components/EstadoCarga';
import Tabla from '../components/Tabla';

const TITULO = 'PISTAS';

export default function SeccionPistas({ usuario, onNoAutorizado }) {
    const { datos, cargando, error } = useDatosAdmin('/admin/pistas', usuario, onNoAutorizado);
    if (cargando || error) return <EstadoCarga titulo={TITULO} error={error} />;

    const { pistas } = datos;
    const usos = pistas.reduce((total, p) => total + p.usos, 0);

    return (
        <>
            <EncabezadoSeccion
                titulo={TITULO}
                resumen={`${pistas.length} pistas (2 por acertijo) · solicitadas ${usos} veces en total. La tercera solicitud de un jugador revela la respuesta.`}
            />
            <Tabla
                encabezados={['ACERTIJO', 'Nº', 'PISTA', 'VECES PEDIDA']}
                filas={pistas}
                renderFila={p => (
                    <>
                        <td>{p.acertijo}</td>
                        <td>{p.orden}</td>
                        <td>{p.descripcion}</td>
                        <td>{p.usos}</td>
                    </>
                )}
            />
        </>
    );
}
