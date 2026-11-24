import { useDatosAdmin } from '../hooks/useDatosAdmin';
import EncabezadoSeccion from '../components/EncabezadoSeccion';
import EstadoCarga from '../components/EstadoCarga';
import EstadoBadge from '../components/EstadoBadge';
import Tabla from '../components/Tabla';
import { formatearFecha, formatearSegundos } from '../utils/formato';

const TITULO = 'INVESTIGACIONES';

export default function SeccionInvestigaciones({ usuario, onNoAutorizado }) {
    const { datos, cargando, error } = useDatosAdmin('/admin/investigaciones', usuario, onNoAutorizado);
    if (cargando || error) return <EstadoCarga titulo={TITULO} error={error} />;

    const lista = datos.investigaciones;
    const finalizadas = lista.filter(i => i.estado === 'FINALIZADA').length;

    return (
        <>
            <EncabezadoSeccion
                titulo={TITULO}
                resumen={`${lista.length} investigaciones · ${lista.length - finalizadas} en progreso · ${finalizadas} finalizadas`}
            />
            <Tabla
                encabezados={['ID', 'DETECTIVE', 'INICIO', 'ESTADO', 'ACERTIJOS', 'INTENTOS', 'PISTAS', 'TIEMPO FINAL']}
                filas={lista}
                renderFila={i => (
                    <>
                        <td>{i.id}</td>
                        <td>{i.nombreUsuario}</td>
                        <td>{formatearFecha(i.fechaInicio)}</td>
                        <td><EstadoBadge estado={i.estado} /></td>
                        <td>{i.acertijosResueltos} / {datos.totalAcertijos}</td>
                        <td>{i.intentos}</td>
                        <td>{i.pistasUsadas}</td>
                        <td>{formatearSegundos(i.tiempoUtilizado)}</td>
                    </>
                )}
            />
        </>
    );
}
