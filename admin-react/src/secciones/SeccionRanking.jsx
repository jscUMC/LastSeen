import { useDatosAdmin } from '../hooks/useDatosAdmin';
import EncabezadoSeccion from '../components/EncabezadoSeccion';
import EstadoCarga from '../components/EstadoCarga';
import Tabla from '../components/Tabla';
import { formatearSegundos } from '../utils/formato';

const TITULO = 'RANKING';

export default function SeccionRanking({ usuario, onNoAutorizado }) {
    const { datos, cargando, error } = useDatosAdmin('/ranking', usuario, onNoAutorizado);
    if (cargando || error) return <EstadoCarga titulo={TITULO} error={error} />;

    return (
        <>
            <EncabezadoSeccion titulo={TITULO} resumen="Top 10 de investigaciones finalizadas por menor tiempo." />
            <Tabla
                encabezados={['POS', 'DETECTIVE', 'TIEMPO']}
                filas={datos.ranking}
                claveFila={(fila, indice) => indice}
                renderFila={(r, indice) => (
                    <>
                        <td>#{indice + 1}</td>
                        <td>{r.nombreUsuario}</td>
                        <td>{formatearSegundos(r.tiempoTotal)}</td>
                    </>
                )}
            />
        </>
    );
}
