import { useDatosAdmin } from '../hooks/useDatosAdmin';
import EncabezadoSeccion from '../components/EncabezadoSeccion';
import EstadoCarga from '../components/EstadoCarga';
import Tabla from '../components/Tabla';
import VistaPrevia from '../components/VistaPrevia';
import { TIPOS_EVIDENCIA } from '../utils/formato';

const TITULO = 'EVIDENCIAS';

export default function SeccionEvidencias({ usuario, onNoAutorizado }) {
    const { datos, cargando, error } = useDatosAdmin('/admin/evidencias', usuario, onNoAutorizado);
    if (cargando || error) return <EstadoCarga titulo={TITULO} error={error} />;

    const { evidencias } = datos;

    return (
        <>
            <EncabezadoSeccion
                titulo={TITULO}
                resumen={`${evidencias.length} evidencias del expediente (incluye las que el jugador aún no ha desbloqueado)`}
            />
            <Tabla
                encabezados={['ID', 'VISTA', 'EVIDENCIA', 'TIPO', 'SE DESBLOQUEA', 'ACERTIJO QUE PLANTEA']}
                filas={evidencias}
                renderFila={ev => (
                    <>
                        <td className="font-bold">{ev.codigo}</td>
                        <td><VistaPrevia evidencia={ev} /></td>
                        <td>
                            <strong>{ev.titulo}</strong>
                            <span className="block text-xs text-neutral-400">{ev.contenido}</span>
                        </td>
                        <td>{TIPOS_EVIDENCIA[ev.tipo]}</td>
                        <td>{ev.desbloqueadaPorCodigo ? `Al resolver ${ev.desbloqueadaPorCodigo}` : 'Desde el inicio'}</td>
                        <td>{ev.acertijo || '—'}</td>
                    </>
                )}
            />
        </>
    );
}
