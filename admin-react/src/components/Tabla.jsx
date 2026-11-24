// Tabla genérica: los encabezados, las filas y cómo pintar cada fila llegan por props.
// renderFila(fila) devuelve las celdas <td> de esa fila.
export default function Tabla({ encabezados, filas, renderFila, claveFila = fila => fila.id }) {
    if (filas.length === 0) {
        return <p className="p-10 text-center text-neutral-500">No hay registros.</p>;
    }

    return (
        <div className="max-h-[calc(100vh-10rem)] overflow-auto border border-neutral-700 bg-neutral-900/90 shadow-2xl">
            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr>
                        {encabezados.map(encabezado => (
                            <th
                                key={encabezado}
                                className="sticky top-0 border-b-2 border-sangre bg-stone-800 px-2 py-2.5 text-left text-xs tracking-widest text-ambar"
                            >
                                {encabezado}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {filas.map((fila, indice) => (
                        <tr
                            key={claveFila(fila, indice)}
                            className="border-b border-neutral-800 align-top hover:bg-ambar/5 [&>td]:px-2 [&>td]:py-2 [&>td:first-child]:whitespace-nowrap"
                        >
                            {renderFila(fila, indice)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}