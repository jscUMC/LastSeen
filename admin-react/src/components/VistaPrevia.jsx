// Vista previa de una evidencia según su tipo: miniatura, reproductor de audio o enlace al PDF
export default function VistaPrevia({ evidencia }) {
    const ruta = `/${evidencia.archivo}`;

    if (evidencia.tipo === 'fotografia') {
        return (
            <a href={ruta} target="_blank" rel="noopener noreferrer">
                <img
                    src={ruta}
                    alt={evidencia.titulo}
                    loading="lazy"
                    className="h-16 w-24 border-[3px] border-neutral-100 object-cover"
                />
            </a>
        );
    }

    if (evidencia.tipo === 'audio') {
        return <audio controls preload="none" src={ruta} className="w-56" aria-label={evidencia.titulo} />;
    }

    return (
        <a href={ruta} target="_blank" rel="noopener noreferrer" className="text-ambar underline">
            Abrir PDF ↗
        </a>
    );
}