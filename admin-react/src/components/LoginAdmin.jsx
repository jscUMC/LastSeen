import { useState } from 'react';
import { NoAutorizadoError } from '../utils/api';

// Acceso directo al panel (por ejemplo con npm run dev o si la sesión expiró).
// onIngresar(usuario) valida el usuario en el backend y lanza un error si no es válido.
export default function LoginAdmin({ onIngresar }) {
    const [usuario, setUsuario] = useState('');
    const [error, setError] = useState('');
    const [enviando, setEnviando] = useState(false);

    async function enviar(evento) {
        evento.preventDefault();
        setError('');
        setEnviando(true);
        try {
            await onIngresar(usuario.trim());
        } catch (e) {
            setError(e instanceof NoAutorizadoError ? 'Usuario de administrador no válido.' : e.message);
            setEnviando(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center p-6">
            <form onSubmit={enviar} className="w-full max-w-sm border-l-8 border-sangre bg-papel p-6 text-neutral-900 shadow-2xl">
                <span className="block text-xs font-bold tracking-widest text-sangre">ACCESO RESTRINGIDO</span>
                <h1 className="mb-4 font-titulo text-2xl">PANEL DE ADMINISTRACIÓN</h1>

                <label htmlFor="usuarioAdmin" className="mb-1 block text-sm font-bold">Usuario del administrador</label>
                <input
                    id="usuarioAdmin"
                    type="password"
                    autoComplete="off"
                    required
                    value={usuario}
                    onChange={e => setUsuario(e.target.value)}
                    className="mb-3 w-full border border-neutral-500 bg-white px-3 py-2 outline-none focus:border-sangre"
                />

                {error && <p role="alert" className="mb-3 text-sm font-bold text-sangre">{error}</p>}

                <button
                    type="submit"
                    disabled={enviando}
                    className="w-full bg-neutral-900 py-2 font-titulo tracking-widest text-papel hover:bg-sangre disabled:opacity-60"
                >
                    {enviando ? 'VERIFICANDO…' : 'INGRESAR'}
                </button>

                <a href="/" className="mt-4 block text-center text-sm underline">← Volver al inicio del juego</a>
            </form>
        </main>
    );
}