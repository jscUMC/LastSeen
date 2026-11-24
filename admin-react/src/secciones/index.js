import SeccionInvestigaciones from './SeccionInvestigaciones';
import SeccionEvidencias from './SeccionEvidencias';
import SeccionAcertijos from './SeccionAcertijos';
import SeccionPistas from './SeccionPistas';
import SeccionRanking from './SeccionRanking';

// Orden del menú lateral. Para agregar una sección basta con añadirla aquí.
export const SECCIONES = [
    { id: 'investigaciones', titulo: 'INVESTIGACIONES', icono: '📁', Componente: SeccionInvestigaciones },
    { id: 'evidencias', titulo: 'EVIDENCIAS', icono: '📋', Componente: SeccionEvidencias },
    { id: 'acertijos', titulo: 'ACERTIJOS', icono: '🧩', Componente: SeccionAcertijos },
    { id: 'pistas', titulo: 'PISTAS', icono: '🔍', Componente: SeccionPistas },
    { id: 'ranking', titulo: 'RANKING', icono: '🏆', Componente: SeccionRanking }
];
