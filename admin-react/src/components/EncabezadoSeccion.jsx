// Título de la sección y una línea de resumen (opcional)
export default function EncabezadoSeccion({ titulo, resumen }) {
    return (
        <header className="mb-4 text-center">
            <h2 className="border border-neutral-700 bg-neutral-800 px-4 py-1 text-left tracking-[0.2em]">
                {titulo}
            </h2>
            {resumen && <p className="mt-2 text-sm text-neutral-400">{resumen}</p>}
        </header>
    );
}