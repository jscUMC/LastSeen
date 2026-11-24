// Menú lateral. Recibe las secciones y avisa con callbacks qué eligió el administrador.
export default function Sidebar({ secciones, seccionActual, onCambiar, onCerrarSesion }) {
    const claseItem = activo =>
        `flex w-full items-center gap-3 px-2 py-2 text-left font-titulo text-lg tracking-widest transition ` +
        (activo ? 'text-white [text-shadow:0_0_10px_#ffb74d]' : 'text-neutral-400 hover:text-white');

    return (
        <aside className="flex w-72 shrink-0 flex-col gap-6 max-md:w-full">
            <div className="border-l-8 border-sangre bg-papel px-4 py-3 text-neutral-900 shadow-lg">
                <span className="block text-xs font-bold tracking-widest text-sangre">ACCESO RESTRINGIDO</span>
                <span className="block font-titulo text-xl leading-tight">PANEL DE ADMINISTRACIÓN</span>
                <span className="block text-sm">Expediente SJ-2025-001</span>
            </div>

            <nav aria-label="Secciones del panel">
                <ul className="space-y-1">
                    {secciones.map(seccion => (
                        <li key={seccion.id}>
                            <button
                                type="button"
                                className={claseItem(seccion.id === seccionActual)}
                                aria-current={seccion.id === seccionActual ? 'page' : undefined}
                                onClick={() => onCambiar(seccion.id)}
                            >
                                <span aria-hidden="true">{seccion.icono}</span> {seccion.titulo}
                            </button>
                        </li>
                    ))}
                    <li>
                        <button type="button" className={claseItem(false)} onClick={onCerrarSesion}>
                            <span aria-hidden="true">🚪</span> CERRAR SESIÓN
                        </button>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}