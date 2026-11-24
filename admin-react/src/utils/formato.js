export const formatearFecha = valor =>
    valor ? new Date(valor).toLocaleString('es-CO') : '—';

export const formatearSegundos = ms =>
    ms == null ? '—' : `${(ms / 1000).toFixed(1)} s`;

export const TIPOS_EVIDENCIA = {
    documento: '📄 Documento',
    fotografia: '📷 Fotografía',
    audio: '🎧 Audio'
};
