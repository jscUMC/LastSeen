import { useState } from 'react';
import { useSesionAdmin } from './hooks/useSesionAdmin';
import LoginAdmin from './components/LoginAdmin';
import Sidebar from './components/Sidebar';
import { SECCIONES } from './secciones';

export default function App() {
    const { usuario, iniciar, cerrar } = useSesionAdmin();
    const [seccionActual, setSeccionActual] = useState(SECCIONES[0].id);

    if (!usuario) {
        return <LoginAdmin onIngresar={iniciar} />;
    }

    const { Componente } = SECCIONES.find(seccion => seccion.id === seccionActual);

    return (
        <div className="flex min-h-screen gap-6 p-5 max-md:flex-col">
            <Sidebar
                secciones={SECCIONES}
                seccionActual={seccionActual}
                onCambiar={setSeccionActual}
                onCerrarSesion={cerrar}
            />
            <main className="flex min-w-0 flex-1 flex-col" aria-live="polite">
                {/* key: al cambiar de sección el componente se monta de nuevo y vuelve a pedir sus datos */}
                <Componente key={seccionActual} usuario={usuario} onNoAutorizado={cerrar} />
            </main>
        </div>
    );
}
