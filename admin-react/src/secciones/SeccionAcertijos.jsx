import { useDatosAdmin } from '../hooks/useDatosAdmin';
import EncabezadoSeccion from '../components/EncabezadoSeccion';
import EstadoCarga from '../components/EstadoCarga';
import Tabla from '../components/Tabla';

const TITULO = 'ACERTIJOS';

export default function SeccionAcertijos({ usuario, onNoAutorizado }) {
    const { datos, cargando, error } = useDatosAdmin('/admin/acertijos', usuario, onNoAutorizado);
    if (cargando || error) return <EstadoCarga titulo={TITULO} error={error} />;

    const { acertijos } = datos;

    return (
        <>
            <EncabezadoSeccion
                titulo={TITULO}
                resumen={`${acertijos.length} acertijos en cadena. La primera respuesta es la canónica; las demás también se aceptan.`}
            />
            <Tabla
                encabezados={['ID', 'ACERTIJO', 'SE PLANTEA EN', 'RESPUESTAS ACEPTADAS', 'DESBLOQUEA']}
                filas={acertijos}
                renderFila={a => (
                    <>
                        <td className="font-bold">{a.codigo}</td>
                        <td>
                            <strong>{a.titulo}</strong>
                            <span className="block text-xs text-neutral-400">{a.pregunta}</span>
                        </td>
                        <td>{a.evidencia}</td>
                        <td>
                            <strong className="text-acierto">{a.respuesta[0]}</strong>
                            {a.respuesta.slice(1).map(r => (
                                <span key={r} className="block text-xs text-neutral-400">{r}</span>
                            ))}
                        </td>
                        <td>{a.desbloquea.join(', ')}</td>
                    </>
                )}
            />
        </>
    );
}
