// Etiqueta del estado de una investigación (EN_PROGRESO / FINALIZADA)
export default function EstadoBadge({ estado }) {
    const finalizada = estado === 'FINALIZADA';

    return (
        <span
            className={`whitespace-nowrap border px-1.5 py-0.5 text-xs font-bold tracking-widest ${
                finalizada ? 'border-green-500 text-green-500' : 'border-ambar text-ambar'
            }`}
        >
            {estado.replace('_', ' ')}
        </span>
    );
}